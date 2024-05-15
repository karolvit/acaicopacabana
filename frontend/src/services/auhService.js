import { api, requestConfig } from "../utils/config";

const login = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/login", config);
    const jsonRes = await res.json();

    if (!res.ok) {
      throw new Error(jsonRes.message || "Erro ao fazer login");
    }

    const { success, expiration, token } = jsonRes;

    if (success) {
      const loginTime = new Date().getTime();
      const expirationDate = new Date(expiration);
      const userData = { token, loginTime, expiration: expirationDate };
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return jsonRes;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const logout = () => {
  localStorage.clear();
};

const authService = {
  login,
  logout,
};
export default authService;
