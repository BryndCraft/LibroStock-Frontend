import { createContext, useContext, useState, useEffect, useRef } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const hasLoaded = useRef(false);

  const loginUser = (userData, token) => {
    setUser(userData);
    setToken(token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    // sessionStorage.removeItem("user");
    // sessionStorage.removeItem("token");
    sessionStorage.clear();
  };

  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      sessionStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    if (!hasLoaded.current){
      hasLoaded.current = true;
      
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, token, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
