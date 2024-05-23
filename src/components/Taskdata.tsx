import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const statuses = {
  Backlog: { displayName: "Backlog", icon: QuestionMarkCircledIcon },
  Todo: { displayName: "To do", icon: CircleIcon },
  InProgress: { displayName: "In progress", icon: StopwatchIcon },
  Done: { displayName: "Done", icon: CheckCircledIcon },
  Canceled: { displayName: "Canceled", icon: CrossCircledIcon },
};

export const priorityIcon = {
  Low: ArrowDownIcon,
  Medium: ArrowRightIcon,
  High: ArrowUpIcon,
};
