import { api, requestConfig } from "../utils/config";

const login = async (data) => {
  const config = requestConfig("POST", data);

  try {
    const res = await fetch(api + "/login", config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res && res.success) {
      const loginTime = new Date().getTime();
      const expiration = new Date(res.expiration);
      const userData = { user: res, loginTime, expiration };
      console.log(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      throw new Error(res.errors[0] || "Erro ao fazer login");
    }
    return res;
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
