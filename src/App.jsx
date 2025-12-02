import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashBoard from "./pages/home/MainPanel/DashBoard";
import Facturacion from "./pages/home/Facturacion/Facturacion";
import Inventario from "./pages/home/Inventory/Inventario";
import { PublicRoute } from "./components/Routes/PublicRoute";
import { PrivateRoute } from "./components/Routes/PrivateRoute";  
import { Public } from "@mui/icons-material";
import Perfil from "./pages/home/Perfil";
import Panel from "./pages/home/MainPanel/Panel";
import Proveedores from "./pages/home/Proveedores/Proveedores";
import Compras from "./pages/home/Compra/Compras";
import Movimientos from "./pages/home/Movimientos/Movimientos";

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
              <Inventario></Inventario>
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
      
          <Route path="/compras" element={
            <PrivateRoute>
              <Compras></Compras>
            </PrivateRoute>
          }/>

          <Route path="/prueba" element={
            <PrivateRoute>
              <Panel/>
            </PrivateRoute>
          }/>

          <Route path="/Movimientos" element={
            <PrivateRoute>
              <Movimientos/>
            </PrivateRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;