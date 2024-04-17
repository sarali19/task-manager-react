import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="bg-red-400">
      Hello World!
      <Button asChild>
        <Link to="tasks">Click Me</Link>
      </Button>
      or
      <Button asChild>
        <Link to="dashboard">Go To Dashboard!</Link>
      </Button>
    </div>
  );
}

export default App;
