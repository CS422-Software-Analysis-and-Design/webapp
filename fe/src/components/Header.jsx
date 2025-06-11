import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const pathSections = location.pathname.split("/").slice(0, 3).join("/");
    
    const menuItems = [
        { route: "/app/home", label: "Home" },
        { route: "/app/products", label: "Products" },
        { route: "/app/compare", label: "Compare" },
        { route: "/app/favourite", label: "Favourite" },
        { route: "/app/chatbot", label: "Chatbot" }
    ];    const handleItemClick = (route) => {
        // Check if we're already on the route to avoid unnecessary navigation        
        if (pathSections !== route) {
            // Navigate to the clicked route
            console.log("Navigating to: ", route);
            navigate(route);
            
            // The ScrollToTop component will handle scrolling
        }
    };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-cyan-400 to-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">VBMatch</h1>
        <nav className="flex space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.route}
                className={`px-4 py-2 rounded 
                  ${
                    pathSections === item.route
                      ? "bg-indigo-800 text-white-bold"
                      : "hover:bg-indigo-800 text-white"
                  }`}
                onClick={() => handleItemClick(item.route)}>
                {item.label}
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
