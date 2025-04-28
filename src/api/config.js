import axios from "axios";
/*
//SE CREA EL OBJETO API PARA CONSUMIRLO CON AXIOS
const api = axios.create({
  baseURL: "https://localhost:7256/api",
  timeout: 10000, //TIEMPO DE ESPERA MAXIMO
});

//SE ENVIA AUTOMATICAMENTE EL JWT
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("jwtToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//SE MANEJAN LOS ERRORES
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("ERROR EN LA CONSULTA", error);

      //localStorage.removeItem('jwtToken');
      //window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);*/

// SE CREA EL OBJETO API PARA CONSUMIRLO CON AXIOS
const api = axios.create({
  baseURL: "https://52.226.126.56:7121/", // API Gateway
  timeout: 10000, // TIEMPO DE ESPERA MÁXIMO
});

// SE ENVÍA AUTOMÁTICAMENTE EL JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// SE MANEJAN LOS ERRORES
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("ERROR EN LA CONSULTA", error);
      localStorage.removeItem("jwtToken"); // Eliminar el token inválido
      window.location.href = "/login"; // Redirigir al login
    }
    return Promise.reject(error);
  }
);

export default api;
