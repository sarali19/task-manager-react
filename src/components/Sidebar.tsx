import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { LayoutDashboard, FolderKanban, SquareCheckBig } from "lucide-react";

const links = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard />,
    href: "dashboard",
  },
  {
    title: "Projects",
    icon: <FolderKanban />,
    href: "projects",
  },
  {
    title: "Tasks",
    icon: <SquareCheckBig />,
    href: "tasks",
  },
];

function isLinkActive(href: string, currentPath: string) {
  const regex = new RegExp(href);
  return regex.test(currentPath);
}

function Sidebar() {
  const { pathname } = useLocation();

  return (
    <div className="bg-background flex flex-col w-72 fixed inset-y-0 z-[80] border-r">
      <div className="px-3 py-2 flex-1">
        {/* Brand logo + name */}
        <Link to="/" className="flex items-center my-7 ms-6 gap-2">
          <div className="w-8 h-8">
            <img
              src="https://cdn.icon-icons.com/icons2/2699/PNG/512/atlassian_jira_logo_icon_170511.png"
              alt="logo"
            />
          </div>
          <div className="text-2xl font-bold text-primary">Taskify</div>
        </Link>
        {/* Links  */}
        <div className="space-y-4 px-3 py-4">
          <div className="space-y-1">
            {links.map((link) => (
              <Button
                variant={
                  isLinkActive(link.href, pathname) ? "default" : "ghost"
                }
                className="w-full justify-start gap-2"
                asChild
                key={link.title}
              >
                <Link to={link.href}>
                  {link.icon}
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default Sidebar;
