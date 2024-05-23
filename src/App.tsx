import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <h1 className="scroll-m-20 text-7xl font-extrabold tracking-tight lg:text-5xl text-center my-11">
        Hello there👋
      </h1>
      <div className="text-center">
        <Button asChild>
          <Link to="tasks">Click Me</Link>
        </Button>
        <span className="mx-3">or</span>
        <Button asChild>
          <Link to="dashboard">Go To Dashboard!</Link>
        </Button>
      </div>
    </>
  );
}

export default App;
