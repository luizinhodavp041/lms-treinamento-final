import { BusFrontIcon, GraduationCap, TvMinimalPlay } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="flex items-center justify-between p-4 border-b relative bg-[#043c6c]">
      <div className="flex items-center space-x-4">
        <Link
          to="/home"
          className="flex items-center text-white hover:text-white"
        >
          <BusFrontIcon className="h-8 w-8 mr-4 " />
          <span className="font-extrabold md:text-xl text-[14px]">
            Viação Piraquara Treinamentos
          </span>
        </Link>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            onClick={() => {
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses");
            }}
            className="text-[14px] md:text-[16px] font-medium"
          >
            Todos os cursos
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex gap-4 items-center">
          <div
            onClick={() => navigate("/student-courses")}
            className="flex cursor-pointer items-center gap-3"
          >
            <span className="font-extrabold md:text-xl text-[14px] text-white">
              Voltar aos meus cursos
            </span>
            <TvMinimalPlay className="w-8 h-8 cursor-pointer text-white" />
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}

export default StudentViewCommonHeader;
