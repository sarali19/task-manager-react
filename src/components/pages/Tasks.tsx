import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/ui/columns";
import { Task } from "@/types";
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";

async function getTasks() {
  const response = await axios.get<Task[]>(
    "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/app/(app)/examples/tasks/data/tasks.json"
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
        <DataTable data={tasks} columns={columns} />
      </div>
    );
}

export default Tasks;
