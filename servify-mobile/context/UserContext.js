import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "User Name",
    email: "user@email.com",
    phone: "+1 234 567 8901",
  });

  const updateUser = (fields) => setUser((prev) => ({ ...prev, ...fields }));

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}