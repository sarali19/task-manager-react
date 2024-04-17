import UserNav from "./UserNav";

function Header() {
  return (
    <div className="bg-background p-4 border-b border-slate-300">
      <div className="flex justify-end">
        <UserNav />
      </div>
    </div>
  );
}
export default Header;
