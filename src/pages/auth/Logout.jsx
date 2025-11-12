import { useNavigate } from "react-router-dom";
import { logoutApi } from "../../apis/auth.api";
import { useUser } from "../../context/UserContext";
import Swal from "sweetalert2";

export function useLogout() {
  const navi = useNavigate();
  const { logoutUser } = useUser();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.warn("Fallo el logout en el backend:", error);
    } finally {

      logoutUser();

      navi("/login");
    }
  };

  return handleLogout;
}
