import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { BusFront } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";

const busAnimationStyles = `
  @keyframes driveBus {
    0% {
      transform: translateX(-200px);
    }
    100% {
      transform: translateX(calc(100vw + 200px));
    }
  }

  .animated-bus {
    position: fixed;
    top: 20%;
    left: 0;
    z-index: 1000;
    animation: driveBus 1.5s linear;
    color: #043C6C;
    transform-origin: center;
  }

  .bus-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const [showBusAnimation, setShowBusAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== ""
    );
  }

  async function handleSignUp(e) {
    try {
      await handleRegisterUser(e);

      // Primeiro, muda para a aba de login
      setActiveTab("signin");

      // Limpa o formulário
      setSignUpFormData({
        userName: "",
        userEmail: "",
        password: "",
      });

      // Inicia as animações
      setShowBusAnimation(true);
      setShowConfetti(true);

      // Remove as animações após o tempo exato da animação
      setTimeout(() => {
        setShowBusAnimation(false);
      }, 1500);
    } catch (error) {
      console.error(error?.message || "Erro ao criar usuário");
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <style>{busAnimationStyles}</style>

      {showBusAnimation && (
        <div className="bus-container">
          <div className="animated-bus">
            <BusFront size={48} />
          </div>
        </div>
      )}

      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-[#043C6C] justify-center">
        <Link to={"/"} className="flex items-center justify-center text-white">
          <BusFront className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">
            Viação Piraquara Treinamentos
          </span>
        </Link>
      </header>

      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Entre na sua conta</CardTitle>
                <CardDescription>
                  Insira seus dados para acessar sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Entrar"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Criar uma nova conta</CardTitle>
                <CardDescription>
                  Insira algumas informações para criarmos sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={"Criar"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleSignUp}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
