import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ReactDom from "react-dom/client";
import { UserProvider } from "./context/UserContext.jsx";
import { CategoriasProvider } from "./context/CategoriasContext.jsx";
import { ProductosProvider } from "./context/ProductosContext.jsx";
import { ProveedorProvider } from "./context/ProveedorContext.jsx";
import { ComprasProvider } from "./context/ComprasContext.jsx";
import { MovimientoProvider } from "./context/MovimientosContext.jsx";
import { VentasProvider } from "./context/VentasContext.jsx";

ReactDom.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <CategoriasProvider>
        <ProductosProvider>
          <ProveedorProvider>
            <ComprasProvider>
              <MovimientoProvider>
                <VentasProvider>
                  <App />
                </VentasProvider>
              </MovimientoProvider>
            </ComprasProvider>
          </ProveedorProvider>
        </ProductosProvider>
      </CategoriasProvider>
    </UserProvider>
  </StrictMode>
);
