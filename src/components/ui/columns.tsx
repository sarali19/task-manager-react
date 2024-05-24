import { ColumnDef } from "@tanstack/react-table";
import { priorityIcon, statuses } from "@/components/Taskdata";
import { Task } from "@/types";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import clsx from "clsx";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Task" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge
            className={clsx({
              "bg-red-400 hover:bg-red-600": row.original.label === "Bug",
              "bg-sky-400 hover:bg-sky-600":
                row.original.label === "Documentation",
              "bg-emerald-400 hover:bg-green-600":
                row.original.label === "Feature",
            })}
          >
            {row.original.label}
          </Badge>
          <Link to={`/teamleader/tasks/${row.original.id}`}>
            <span className="max-w-[500px] truncate font-medium hover:underline">
              {row.getValue("title")}
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "project.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Project" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium hover:underline">
            {row.original.project.name}
          </span>
        </div>
      );
    },
  },
  {
    id: "member",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Member" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium hover:underline">
            {row.original.member.firstName + " " + row.original.member.lastName}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses?.[row.original.status].displayName;
      const Icon = statuses?.[row.original.status].icon;
      return (
        <div className="flex w-[100px] items-center">
          <Icon className="mr-2 h-4 w-4 text-muted-foreground" />

          <span>{status}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => {
      const priority = row.original.priority;
      const Icon = priorityIcon?.[priority];
      return (
        <div className="flex w-[100px] items-center">
          <Icon className="mr-2 h-4 w-4 text-muted-foreground" />

          <span>{priority}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
