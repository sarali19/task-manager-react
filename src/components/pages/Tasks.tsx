import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/ui/columns";
import { Task } from "@/types";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/select";

async function getTasks() {
  const response = await axios.get<Task[]>(
    // "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/app/(app)/examples/tasks/data/tasks.json"
    "http://localhost:8000/tasks"
  );
  const tasks = response.data;
  return tasks;
}

function Tasks() {
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  if (!tasks || isLoading) return <Loading />;
  else if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;
  else
    return (
      <div className="bg-background">
        <PageTitle>Tasks</PageTitle>
        <Sheet>
          <SheetTrigger>
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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    {/* <SelectValue placeholder="Select a fruit" />  */}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inprogress">In progress</SelectItem>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="canceled">Canceled</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="label" className="text-right">
                  Label
                </Label>
                <Select>
                  <SelectTrigger className="w-[180px]"></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inprogress">Documentation</SelectItem>
                    <SelectItem value="backlog">Bug</SelectItem>
                    <SelectItem value="todo">Feature</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select>
                  <SelectTrigger className="w-[180px]"></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inprogress">Low</SelectItem>
                    <SelectItem value="backlog">Medium</SelectItem>
                    <SelectItem value="todo">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <DataTable data={tasks} columns={columns} />
      </div>
    );
}

export default Tasks;
