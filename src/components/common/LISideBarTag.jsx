import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const LISideBarTag = ({ menuItems }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button - Only visible on small screens */}
      <div className={`fixed top-4 left-4 z-100 sm:hidden `}>
        <button
          className="p-2 bg-[#ae7aff] text-white rounded-md"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X color="#ffffff" size={20} />
          ) : (
            <Menu color="#ffffff" size={20} />
          )}
        </button>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-65 z-30 sm:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed left-0 z-40 w-[250px] bg-black border-r border-zinc-800
        transition-transform duration-300 ease-in-out
        h-[calc(100vh-66px)] top-[72px] sm:h-[calc(100vh-74px)] sm:top-[72px]
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        sm:translate-x-0
      `}
      >
        <ul className="flex flex-col p-2 gap-2 h-full overflow-y-auto">
          {menuItems.map((item, index) => (
            <Link
              to={`${item.to}`}
              key={index}
              onClick={() => {
                console.log("Sidebar link clicked:", item.to);
                if (window.innerWidth < 640) setIsMobileOpen(false); // close only on mobile
              }}
            >
              <li>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-white hover:bg-zinc-800 rounded-md transition-colors duration-200">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            </Link>
          ))}
        </ul>
      </aside>
    </>
  );
};

export default LISideBarTag;
