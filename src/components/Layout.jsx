import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="h-screen w-full flex flex-row">
      <Sidebar/>
      <div className="flex flex-col">
        {children}
      </div>
    </div>

  );
}
