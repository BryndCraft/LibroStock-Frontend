// import { createContext, useContext, useState } from "react";

// const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [token, setToken] = useState(null); 

//     const loginUser = (userData, token) => {
//         setUser(userData);
//         setToken(token);
//         localStorage.setItem("user", JSON.stringify(userData));
//         localStorage.setItem("token", token);
//     };
//     const logoutUser = () => {
//         setUser(null);
//         setToken(null);
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//     };
// const updateUser = (newData) => {
//   setUser((prev) => {
//     const updated = { ...prev, ...newData };
//     localStorage.setItem("user", JSON.stringify(updated));
//     return updated;
//   });
// };
//     return (
//         <UserContext.Provider value={{ user, token, loginUser, logoutUser, updateUser }}>
//             {children}
//         </UserContext.Provider>
//     )
// };

// export const useUser = () => useContext(UserContext);


import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const loginUser = (userData, token) => {
    setUser(userData);
    setToken(token);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", token);
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  const updateUser = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      sessionStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, token, loginUser, logoutUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
