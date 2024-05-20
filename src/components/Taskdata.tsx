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

export const statusIcon = {
  Backlog: QuestionMarkCircledIcon,
  "To do": CircleIcon,
  "In progress": StopwatchIcon,
  Done: CheckCircledIcon,
  Canceled: CrossCircledIcon,
};

export const priorityIcon = {
  Low: ArrowDownIcon,
  Medium: ArrowRightIcon,
  High: ArrowUpIcon,
};
