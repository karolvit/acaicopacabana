import axios from "axios";

const apiAcai = axios.create({
  baseURL: "http://localhost:21176",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiAcai;
