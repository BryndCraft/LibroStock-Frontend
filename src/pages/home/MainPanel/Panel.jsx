import { motion, AnimatePresence } from "framer-motion";
import { AnimatedContainer } from "../../../animations/animations";
import Sidebar from "../../../components/utils/Sidebar";
import VistaDashBoard from "./components/VistaDashBoard";


export default function Panel() {
  return (
   <div className="min-h-screen w-full flex">
    <Sidebar/>
    <VistaDashBoard/>
   </div>
  );
}
