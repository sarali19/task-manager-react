import React from "react";
import PageTitle from "@/components/PageTitle";
import {
  Card,
  CardContent,
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
import axios from "axios";
import { Project } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

async function getProjects() {
  const response = await axios.get<Project[]>("http://localhost:8080/api/projects");
  const projects = response.data;
  return projects;
}

async function deleteProject(projectId: number) {
  await axios.delete(`http://localhost:8080/api/projects/${projectId}`);
}

function Projects() {
  const queryClient = useQueryClient();
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const mutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
    },
  });

  if (!projects || isLoading) return <Loading />;
  else if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;
  else
    return (
      <div className="bg-background">
        <PageTitle>Projects Page</PageTitle>

        <div className="grid gap-4 grid-cols-4">
          {projects.map((project) => (
            <ContextMenu key={project.id}>
              <ContextMenuTrigger>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Project #{project.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {project.name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>Edit project</ContextMenuItem>
                <ContextMenuItem onClick={() => mutation.mutate(project.id)}>
                  Delete project
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
    );
}
export default Projects;
