import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="h-full relative">
      <Sidebar />
      <main className="ml-72 flex-grow w-auto">
        <Header />
        <div className="p-9">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
