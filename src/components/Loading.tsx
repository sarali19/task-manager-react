import { LoaderCircle } from "lucide-react";

function Loading() {
  return (
    <div className="flex justify-center">
      <LoaderCircle size={64} strokeWidth={3} className="animate-spin" />
    </div>
  );
}
export default Loading;
