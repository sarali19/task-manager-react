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
import axios from "axios";
import { Project } from "@/types";
import { useQuery } from "@tanstack/react-query";

async function getProjects() {
  const response = await axios.get<Project[]>("http://localhost:8000/projects");
  const projects = response.data;
  return projects;
}

function Projects() {
  const {
    data: projects,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (!projects || isLoading) return <Loading />;
  else if (error)
    return <div className="bg-red-600 text-white">{error.message}</div>;
  else
    return (
      <div className="bg-background">
        <PageTitle>Projects Page</PageTitle>

        <div>
          <ContextMenu>
            <ContextMenuTrigger className="grid gap-4 grid-cols-4">
              {projects.map((project) => (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Project #{project.idProject}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {project.titleProject}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {project.descriptionProject}
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
