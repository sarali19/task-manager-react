import PageTitle from "@/components/PageTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Task, Project, Member } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

const taskFormSchema = z.object({
  id: z.number().optional(),
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
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

async function getProjects() {
  const response = await axios.get<Project[]>(
    "http://localhost:8080/api/projects"
  );
  return response.data;
}
async function getMembers() {
  const response = await axios.get<Member[]>(
    "http://localhost:8080/api/members"
  );
  return response.data;
}
async function getTaskById(id: number | undefined) {
  if (!id) return;
  const response = await axios.get<Task>(
    `http://localhost:8080/api/tasks/${id}`
  );
  return response.data;
}

function TaskPage() {
  const { taskId } = useParams();
  const taskIdNumber = taskId ? Number(taskId) : undefined;
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", taskIdNumber],
    queryFn: () => getTaskById(taskIdNumber),
  });

  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const { data: members, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const { isPending, mutateAsync: updateTask } = useMutation({
    mutationFn: (task: TaskFormValues) => {
      return axios.put(`http://localhost:8080/api/tasks/${taskId}`, {
        ...task,
        id: taskIdNumber,
        memberId: Number(task.memberId),
        projectId: Number(task.projectId),
      });
    },
    onError: () => {
      toast("Error updating the task", {
        description: new Date().toLocaleDateString(),
      });
    },
    onSuccess: () => {
      toast("Task updated successfully!", {
        description: new Date().toLocaleDateString(),
      });
    },
  });

  const { mutateAsync: deleteTask } = useMutation({
    mutationFn: () => {
      return axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
    },
    onSuccess: () => {
      navigate("/tasks", { replace: true });
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
      projectId: "",
      memberId: "",
      dueDate: new Date(),
    },
  });

  useEffect(() => {
    if (data?.id) {
      form.reset({
        title: data?.title,
        description: data?.description,
        status: data?.status,
        label: data?.label,
        priority: data?.priority,
        projectId: data?.project.id + "",
        memberId: data?.member.id + "",
        dueDate: new Date(data?.dueDate),
      });
    }
  }, [data]);

  async function submitTask(task: TaskFormValues) {
    await updateTask(task);
  }

  if (isLoading || isLoadingMembers || isLoadingProjects)
    return <div>Loading...</div>;
  else if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;
  else
    return (
      <>
        <PageTitle>{data?.title}</PageTitle>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitTask)} className="space-y-4">
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="InProgress">In progress</SelectItem>
                        <SelectItem value="Backlog">Backlog</SelectItem>
                        <SelectItem value="Todo">To do</SelectItem>
                        <SelectItem value="Canceled">Canceled</SelectItem>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

            <FormField
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              Update task
            </Button>
            <Button
              variant="destructive"
              type="button"
              className="mx-4"
              onClick={() => deleteTask()}
            >
              Delete Task
            </Button>
          </form>
        </Form>
      </>
    );
}

export default TaskPage;
