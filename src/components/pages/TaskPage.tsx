import PageTitle from "@/components/PageTitle";
import { Task } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

async function getTaskById(id: string | undefined) {
  if (!id) return;
  const response = await axios.get<Task>(`http://localhost:8000/tasks/${id}`);
  const task = response.data;
  return task;
}

function TaskPage() {
  const { taskId } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", taskId],
    queryFn: () => getTaskById(taskId),
  });

  if (isLoading) return <div>Loading...</div>;
  else if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;
  else
    return (
      <div>
        <PageTitle>{data?.id}</PageTitle>
        <div>Task Title: {data?.title}</div>
      </div>
    );
}

export default TaskPage;
