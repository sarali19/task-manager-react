import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Tasks from "./components/pages/Tasks.tsx";
import ErrorPage from "./components/pages/ErrorPage.tsx";
import TaskPage from "./components/pages/TaskPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./styles.css";
import Dashboard from "./components/pages/Dashboard.tsx";
import Layout from "./components/Layout.tsx";
import Projects from "./components/pages/Projects.tsx";
import ProjectPage from "@/components/pages/ProjectPage.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      {
        path: "projects/:projectId",
        element: <ProjectPage />,
      },
      {
        path: "tasks",
        element: <Tasks />,
      },
      {
        path: "tasks/:taskId",
        element: <TaskPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools /> */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
