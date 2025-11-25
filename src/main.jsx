import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ReactDom from "react-dom/client";
import { UserProvider } from "./context/UserContext.jsx";
import { CategoriasProvider } from "./context/CategoriasContext.jsx";
import { ProductosProvider } from "./context/ProductosContext.jsx";
import { ProveedorProvider } from "./context/ProveedorContext.jsx";
ReactDom.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <CategoriasProvider>
        <ProductosProvider>
          <ProveedorProvider>
            <App />
          </ProveedorProvider>
        </ProductosProvider>
      </CategoriasProvider>
    </UserProvider>
  </StrictMode>
);
