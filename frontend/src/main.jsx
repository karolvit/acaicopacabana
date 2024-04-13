import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./rotas/Home.jsx";
import TelaDeLogin from "./rotas/TelaDeLogin.jsx";
import PDV from "./rotas/PDV.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";
import App from "./App.jsx";
import Estoque from "./rotas/Estoque.jsx";
import Modal from "react-modal";
import Usuarios from "./rotas/Usuarios.jsx";

Modal.setAppElement("#root");
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <TelaDeLogin />,
      },
      {
        path: "/pdv",
        element: <PDV />,
      },
      {
        path: "/estoque",
        element: <Estoque />,
      },
      {
        path: "/usuarios",
        element: <Usuarios />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  </React.StrictMode>
);
