import PageTitle from "@/components/PageTitle";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/components/Loading";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from "axios";
import { Project } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const projectFormSchema = z.object({
  title: z
    .string({
      required_error: "Please fill out the title.",
    })
    .min(2)
    .max(50),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

async function getProjects() {
  const response = await axios.get<Project[]>("http://localhost:8000/projects");
  const projects = response.data;
  return projects;
}

function Projects() {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (newProject: ProjectFormValues) => {
      console.log(newProject);
      return axios.post("http://localhost:8000/projects", newProject);
    },
    onError: () => {
      console.log("Error creating a new project");
    },
    onSuccess: () => {
      console.log("Project created successfully");
    },
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function submitProject(values: ProjectFormValues) {
    await mutateAsync(values);
    setSheetOpen(false);
    form.reset();
    refetch();
  }

  if (!projects || isLoading) return <Loading />;
  else if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;
  else
    return (
      <div className="bg-background">
        <PageTitle>Projects Page</PageTitle>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="mb-7">
              <CirclePlus className="mr-2 h-4 w-4" />
              Create new project
            </Button>
          </SheetTrigger>

          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Create new project</SheetTitle>
              <SheetDescription>
                Fill in the necessary information in order to add a new project.
                Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            {/* Form starts here */}
            <div className="grid gap-4 py-4">
              {isPending ? (
                <Loading />
              ) : (
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(submitProject)}
                    className="space-y-4"
                  >
                    <FormField
                      name="title"
                      control={form.control}
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="description"
                      control={form.control}
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isPending}>
                      Create project
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div>
          <ContextMenu>
            <ContextMenuTrigger className="grid gap-4 grid-cols-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="hover:bg-slate-100 hover:cursor-pointer"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Project #{project.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{project.title}</div>
                    <p className="text-xs text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Edit project</ContextMenuItem>
              <ContextMenuItem>Delete project</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    );
}
export default Projects;
