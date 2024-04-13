import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Home from "./rotas/Home";
import TelaDeLogin from "./rotas/TelaDeLogin";
import PDV from "./rotas/PDV";
import Estoque from "./rotas/Estoque";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Usuarios from "./rotas/Usuarios";
function App() {
  const { auth, loading } = useAuth();

  console.log(loading);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="/" element={auth ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={!auth ? <TelaDeLogin /> : <Navigate to="/" />}
        />
        <Route
          path="/pdv"
          element={auth ? <PDV /> : <Navigate to="/login" />}
        />
        <Route
          path="/estoque"
          element={auth ? <Estoque /> : <Navigate to="/login" />}
        />
        <Route
          path="/usuarios"
          element={auth ? <Usuarios /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
}

export default App;
