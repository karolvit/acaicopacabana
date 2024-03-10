import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Home from "./rotas/Home";
import TelaDeLogin from "./rotas/TelaDeLogin";
import PDV from "./rotas/PDV";

function App() {
  const { auth, loading } = useAuth();

  console.log(loading);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="App">
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
      </Routes>
    </div>
  );
}

export default App;
