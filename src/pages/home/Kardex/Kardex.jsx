import Sidebar from "../../../components/utils/Sidebar"
import VistaKardex from "./components/VistaKardex"
export default function Kardex(){


    return(
        <div className="flex w-full h-screen">
            <Sidebar/>
            <VistaKardex/>
        </div>
    )
    
}