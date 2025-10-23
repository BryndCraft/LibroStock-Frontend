import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashBoard from "./pages/home/DashBoard";
import Facturacion from "./pages/home/Facturacion";
import Inventario from "./pages/home/Inventario";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashBoard/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/facturacion" element={<Facturacion/>} />
          <Route path="/inventario" element={<Inventario/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
