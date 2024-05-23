import { Outlet } from "react-router-dom";
import Header from "../Header";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="h-full relative">
      <AdminSidebar />
      <main className="ml-72 flex-grow w-auto">
        <Header />
        <div className="p-9">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
