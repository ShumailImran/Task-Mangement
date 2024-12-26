import { Navigate, Route, Routes, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MobileSidebar from "./components/MobileSidebar";
import TaskDetails from "./pages/TaskDetails";
import Tasks from "./pages/Tasks";
import Trash from "./pages/Trash";
import Users from "./pages/Users";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";

function Layout({ toggleDarkMode, darkMode }) {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  return user ? (
    <div className=" w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white dark:bg-[#121212] sticky top-0 hidden md:block">
        <Sidebar />
      </div>

      <MobileSidebar />
      <div className="flex-1 overflow-y-auto">
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    }
  };
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6] dark:bg-[#1f1f1f]">
      <Routes>
        <Route
          element={
            <Layout toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/completed/:status" element={<Tasks />} />
          <Route path="/in-progress/:status" element={<Tasks />} />
          <Route path="/todo/:status" element={<Tasks />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
