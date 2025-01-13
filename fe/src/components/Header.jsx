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
    ];

    const handleItemClick = (route) => {
        // Navigate to the clicked route
        console.log("Navigating to: ", route);
        navigate(route);
    };
  return (
    <header className="bg-purple-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">VBMatch</h1>
        <nav className="flex space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.route}
                className={`px-4 py-2 rounded 
                  ${
                    pathSections === item.route
                      ? "bg-blue-500 text-white-bold"
                      : "hover:bg-gray-200 text-gray-700"
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
