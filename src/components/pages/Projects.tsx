import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Project } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const projectFormSchema = z.object({
  name: z
    .string({
      required_error: "Please fill out the title.",
    })
    .min(2)
    .max(50),
  description: z.string().optional(),
  teamLeadId: z.string(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

async function getProjects() {
  const response = await axios.get<Project[]>(
    "http://localhost:8080/api/projects"
  );
  return response.data;
}

function Projects() {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: projects,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { isPending, mutateAsync: createProject } = useMutation({
    mutationFn: (newProject: ProjectFormValues) => {
      const { teamLeadId, ...project } = newProject;
      return axios.post(
        `http://localhost:8080/api/projects/create/${teamLeadId}`,
        project
      );
    },
    onError: () => {
      console.log("Error creating a new project");
    },
    onSuccess: () => {
      console.log("Project created successfully");
    },
  });

  const { mutateAsync: deleteProjectMutation } = useMutation({
    mutationFn: (projectId: number) => {
      return axios.delete(`http://localhost:8080/api/projects/${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      teamLeadId: "",
    },
  });

  async function submitProject(project: ProjectFormValues) {
    await createProject(project);
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
                      name="name"
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

                    <FormField
                      name="teamLeadId"
                      control={form.control}
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Team Leader</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a team leader" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">Sara Lissaoui</SelectItem>
                              </SelectContent>
                            </Select>
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

        <div className="grid gap-4 grid-cols-4">
          {projects.map((project) => (
            <Dialog key={project.id}>
              <ContextMenu>
                <ContextMenuTrigger>
                  <Card
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="hover:bg-slate-100 hover:cursor-pointer"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Project #{project.id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{project.name}</div>
                      <p className="text-xs text-muted-foreground">
                        {project.description}
                      </p>
                    </CardContent>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>Edit project</ContextMenuItem>
                  <DialogTrigger asChild>
                    <ContextMenuItem className="text-destructive">
                      Delete project
                    </ContextMenuItem>
                  </DialogTrigger>
                </ContextMenuContent>
              </ContextMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    this project.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => deleteProjectMutation(project.id)}
                  >
                    Delete project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    );
}
export default Projects;
