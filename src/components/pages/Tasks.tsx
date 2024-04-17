import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Task } from "@/types";
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";

async function getTasks() {
  const response = await axios.get<Task[]>(
    "https://jsonplaceholder.typicode.com/todos"
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
        {tasks.map((task) => (
          <Card key={task.id} className="w-40">
            <CardHeader>
              <CardTitle>{task.title}</CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet consectetur.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>{task.title}</div>
              <div>{task.userId}</div>
              <div>{task.completed ? "✅" : "❌"}</div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link to={`/tasks/${task.id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
}

export default Tasks;
