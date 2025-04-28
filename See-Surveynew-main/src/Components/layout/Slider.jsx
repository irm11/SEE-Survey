// SidebarTabs.jsx
import { NavLink } from "react-router-dom";
import {
  House,
  Power,
  Calendar,
  TentTree,
  RadioTower,
  CircleHelp,
} from "lucide-react";

const SidebarTabs = () => {
  const navItems = [
    { label: "Site Info", icon: <House size={20} />, path: "/site-info" },
    { label: "AC Power", icon: <Power size={20} />, path: "/ac-power" },
    { label: "Room", icon: <Calendar size={20} />, path: "/room" },
    { label: "Outdoor", icon: <TentTree size={20} />, path: "/outdoor" },
    { label: "Existing Radio", icon: <RadioTower size={20} />, path: "/existing-radio" },
    { label: "New Radio", icon: <RadioTower size={20} />, path: "/new-radio" },
    { label: "H&S", icon: <CircleHelp size={20} />, path: "/hs" },
  ];

  return (
    <aside className="w-60 bg-white border-r shadow p-4 min-h-screen">
      <nav className="space-y-3">
        {navItems.map(({ label, icon, path }) => (
          <NavLink
            to={path}
            key={label}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded font-bold cursor-pointer ${
                isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SidebarTabs;
