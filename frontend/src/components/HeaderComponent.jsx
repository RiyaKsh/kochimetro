// components/Header.jsx
import { useEffect, useState } from "react";
export default function HeaderComponent() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const name = localStorage.getItem("loggedInUser");
    if (name) {
      setUserName(name);
    }
  }, []);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow">
      <input
        type="text"
        placeholder="Search..."
        className="border rounded px-3 py-1 w-1/3"
      />
      <div className="flex items-center gap-4">
        <button className="relative">
          🔔
        </button>
        <button className="flex items-center gap-2 border rounded px-3 py-1">
          <span>{userName}</span>
        </button>
        
      </div>
    </header>
  );
}
