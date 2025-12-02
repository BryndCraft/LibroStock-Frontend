import Sidebar from "../../../components/utils/Sidebar"
import VistaKardex from "./components/VistaMovimientos"
export default function Movimientos(){


    return(
        <div className="flex w-full h-screen">
            <Sidebar/>
            <VistaKardex/>
        </div>
    )
    
}