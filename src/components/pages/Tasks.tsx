import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/ui/columns";
import { Member, Project, Task } from "@/types";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/Loading";
import { CirclePlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const taskFormSchema = z.object({
  title: z
    .string({
      required_error: "Please fill out the title.",
    })
    .min(2)
    .max(50),
  description: z.string(),
  status: z.string({
    required_error: "Please select a status to display.",
  }),
  label: z.string({
    required_error: "Please select a label to display.",
  }),
  priority: z.string({
    required_error: "Please select a priority to display.",
  }),
  memberId: z.string(),
  projectId: z.string(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

async function getTasks() {
  const response = await axios.get<Task[]>("http://localhost:8080/api/tasks");
  return response.data;
}
async function getMembers() {
  const response = await axios.get<Member[]>(
    "http://localhost:8080/api/members"
  );
  return response.data;
}
async function getProjects() {
  const response = await axios.get<Project[]>(
    "http://localhost:8080/api/projects"
  );
  return response.data;
}

function Tasks() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const {
    data: tasks,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const { isPending, mutateAsync: createTask } = useMutation({
    mutationFn: (newTask: TaskFormValues) => {
      const { projectId, memberId, ...task } = newTask;
      return axios.post(
        `http://localhost:8080/api/tasks/project/${projectId}/member/${memberId}`,
        task
      );
    },
    onError: () => {
      console.log("Error creating a new task");
    },
    onSuccess: () => {
      toast("Task created successfully!", {
        description: new Date().toLocaleDateString(),
      });
    },
  });

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      label: "",
      priority: "",
      memberId: "",
      projectId: "",
    },
  });

  async function submitTask(values: TaskFormValues) {
    try {
      await createTask(values);
      setSheetOpen(false);
      form.reset();
      refetch();
    } catch (error) {
      console.error("Promise rejected with error: " + error);
    }
  }

  if (!tasks || isLoading) return <Loading />;
  else if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;
  else
    return (
      <div className="bg-background">
        <PageTitle>Tasks</PageTitle>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="mb-7">
              <CirclePlus className="mr-2 h-4 w-4" />
              Create new task
            </Button>
          </SheetTrigger>

          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Create new task</SheetTitle>
              <SheetDescription>
                Fill in the necessary information in order to add a new task.
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
                    onSubmit={form.handleSubmit(submitTask)}
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

                    <FormField
                      name="status"
                      control={form.control}
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="In progress">
                                  In progress
                                </SelectItem>
                                <SelectItem value="Backlog">Backlog</SelectItem>
                                <SelectItem value="To do">Todo</SelectItem>
                                <SelectItem value="Canceled">
                                  Canceled
                                </SelectItem>
                                <SelectItem value="Done">Done</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="label"
                      control={form.control}
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Label</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a label" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Documentation">
                                  Documentation
                                </SelectItem>
                                <SelectItem value="Bug">Bug</SelectItem>
                                <SelectItem value="Feature">Feature</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="priority"
                      control={form.control}
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="projectId"
                      control={form.control}
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoadingProjects}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a project" />
                              </SelectTrigger>
                              <SelectContent>
                                {projects?.map((pr) => (
                                  <SelectItem key={pr.id} value={`${pr.id}`}>
                                    {pr.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="memberId"
                      control={form.control}
                      disabled={isPending}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignee</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isLoadingMembers}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select the assignee" />
                              </SelectTrigger>
                              <SelectContent>
                                {members?.map((m) => (
                                  <SelectItem key={m.id} value={`${m.id}`}>
                                    {m.firstName + " " + m.lastName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isPending}>
                      Create task
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <DataTable data={tasks} columns={columns} />
      </div>
    );
}

export default Tasks;
