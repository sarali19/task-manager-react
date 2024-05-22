import PageTitle from "@/components/PageTitle";
import { Project } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";

async function getProjectById(id: string | undefined) {
  if (!id) return;
  const response = await axios.get<Project>(
    `http://localhost:8000/projects/${id}`
  );
  return response.data;
}

function ProjectPage() {
  const { projectId } = useParams();
  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects", projectId],
    queryFn: () => getProjectById(projectId),
  });

  if (isLoading) return <div>Loading...</div>;
  else if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;
  else
    return (
      <div>
        <PageTitle>{project?.id}</PageTitle>
        <div>Task Title: {project?.name}</div>
      </div>
    );
}

export default ProjectPage;
