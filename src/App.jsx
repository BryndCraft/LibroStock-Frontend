import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashBoard from "./pages/home/DashBoard";
import Facturacion from "./pages/home/Facturacion";
import Inventario from "./pages/home/Inventario";
import { PublicRoute } from "./components/Routes/PublicRoute";
import { PrivateRoute } from "./components/Routes/PrivateRoute";  
import { Public } from "@mui/icons-material";
import Perfil from "./pages/home/Perfil";
import Proveedores from "./pages/home/Proveedores";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/dashboard" element=
          {<PrivateRoute>
            <DashBoard/>
          </PrivateRoute>} />
          <Route path="/login" element=
          {<PublicRoute>
            <Login/>
          </PublicRoute>} />
          <Route path="/facturacion" element={
            <PrivateRoute>
              <Facturacion/>
            </PrivateRoute>
            } />
          <Route path="/inventario" element=
          {
            <PrivateRoute>
              <Inventario/>
            </PrivateRoute>
          } />
          <Route path="/perfil" element=
          {<PrivateRoute>
            <Perfil/>
          </PrivateRoute>} />
          <Route path="/proveedores" element=
          {<PrivateRoute>
            <Proveedores/>
          </PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;