export const signUpFormControls = [
  {
    name: "userName",
    label: "Usuário",
    placeholder: "Insira seu nome de usuário",
    type: "text",
    componentType: "input",
  },
  {
    name: "userEmail",
    label: "E-mail",
    placeholder: "Insira seu e-mail",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Senha",
    placeholder: "Insira sua senha",
    type: "password",
    componentType: "input",
  },
];

export const signInFormControls = [
  {
    name: "userEmail",
    label: "E-mail",
    placeholder: "Insira seu e-mail",
    type: "email",
    componentType: "input",
  },
  {
    name: "password",
    label: "Senha",
    placeholder: "Insira sua senha",
    type: "password",
    componentType: "input",
  },
];

export const initialSignInFormData = {
  userEmail: "",
  password: "",
};

export const initialSignUpFormData = {
  userName: "",
  userEmail: "",
  password: "",
};

export const languageOptions = [
  { id: "english", label: "Inglês" },
  { id: "spanish", label: "Espanhol" },
  { id: "french", label: "Francês" },
  { id: "german", label: "Alemão" },
  { id: "chinese", label: "Chinês" },
  { id: "japanese", label: "Japonês" },
  { id: "korean", label: "Coreano" },
  { id: "portuguese", label: "Português" },
  { id: "arabic", label: "Árabe" },
  { id: "russian", label: "Russo" },
];

export const courseLevelOptions = [
  { id: "beginner", label: "Iniciante" },
  { id: "intermediate", label: "Intermediário" },
  { id: "advanced", label: "Avançado" },
];

export const courseCategories = [
  { id: "direcao-defensiva", label: "Direção defensiva" },
  {
    id: "outros",
    label: "Outras categorias serão criadas junto ao Setor de Treinamento",
  },
];

export const courseLandingPageFormControls = [
  {
    name: "title",
    label: "Título",
    componentType: "input",
    type: "text",
    placeholder: "Insira o título do curso",
  },
  {
    name: "category",
    label: "Categoria",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseCategories,
  },
  {
    name: "level",
    label: "Nível",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: courseLevelOptions,
  },
  {
    name: "primaryLanguage",
    label: "Idioma do curso",
    componentType: "select",
    type: "text",
    placeholder: "",
    options: languageOptions,
  },
  {
    name: "subtitle",
    label: "Subtítulo ",
    componentType: "input",
    type: "text",
    placeholder: "Insira o subtítulo do curso",
  },
  {
    name: "description",
    label: "Descrição",
    componentType: "textarea",
    type: "text",
    placeholder: "Insira a descrição do curso",
  },
  {
    name: "pricing",
    label: "Preço",
    componentType: "input",
    type: "number",
    placeholder: "Insira o preço do curso",
  },
  {
    name: "objectives",
    label: "Objetivo",
    componentType: "textarea",
    type: "text",
    placeholder: "Insira o que você vai ensinar no curso",
  },
  {
    name: "welcomeMessage",
    label: "Mensagem de boas vindas",
    componentType: "textarea",
    placeholder: "Insira uma mensagem de boas vindas aos colaboradores",
  },
];

export const courseLandingInitialFormData = {
  title: "",
  category: "",
  level: "",
  primaryLanguage: "",
  subtitle: "",
  description: "",
  pricing: "",
  objectives: "",
  welcomeMessage: "",
  image: "",
};

export const courseCurriculumInitialFormData = [
  {
    title: "",
    videoUrl: "",
    freePreview: false,
    public_id: "",
  },
];

export const sortOptions = [
  { id: "price-lowtohigh", label: "Preço: Menor ao maior" },
  { id: "price-hightolow", label: "Preço: Maior ao menor" },
  { id: "title-atoz", label: "Título: Crescente" },
  { id: "title-ztoa", label: "Title: Decrescente" },
];

export const filterOptions = {
  category: courseCategories,
  level: courseLevelOptions,
  primaryLanguage: languageOptions,
};
