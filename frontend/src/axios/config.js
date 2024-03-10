import axios from "axios";

const apiAcai = axios.create({
  baseURL: "http://localhost:3050",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiAcai;
