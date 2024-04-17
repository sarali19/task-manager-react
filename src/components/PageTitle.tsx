import { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

type Props = {
  children: ReactNode;
};

function PageTitle({ children }: Props) {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight capitalize">
        {children}
      </h1>
      <Separator className="my-5" />
    </>
  );
}

export default PageTitle;
