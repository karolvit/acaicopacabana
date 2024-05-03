import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { FaPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
const NavBar = styled.nav`
  margin: auto;
  height: 80px;
  margin-top: 5px;
  width: 95%;
  background-color: #46295a;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 10px;
`;
const Flex = styled.div`
  display: flex;
`;
const ContainerFlex = styled.div`
  background-image: url(${imgFundo});
  background-repeat: no-repeat;
  background-position: center;
`;

const InputPesquisa = styled.input`
  min-width: 25%;
  border-radius: 10px;
  height: 50px;
  padding-left: 10px;
  margin-left: 45px;
  border: none;
  font-size: 20px;
`;

const InputButao = styled.input`
  min-width: 19%;
  border-radius: 10px;
  height: 50px;
  padding-left: 10px;
  border: none;
  color: #5f387a;
  font-size: 30px;
  font-weight: 800;
  cursor: pointer;
`;
const Tabela = styled.table`
  width: 95%;
  border-collapse: collapse;
  border: none;
  table-layout: fixed;
  margin: auto;
  margin-top: 70px;

  th,
  td {
    border: none;
    padding: 8px;
    text-align: center;
  }
  td {
    border-bottom: 2px solid #9582a1;
    color: #261136;
    font-weight: 900;
    font-size: 20px;
  }
  th {
    background-color: #46295a;
    color: #fff;
  }
  td img {
    margin-top: 10px;
    width: 35%;
  }
`;

const ModalCadastroProduto = styled.div`
  background-color: #46295a;
  height: 40px;
  display: flex;
  justify-content: flex-start;
  gap: 35%;
  align-items: center;
  margin-bottom: 40px;
  width: 100%;

  h2 {
    font-size: 25px;
    color: #f3eef7;
    text-align: center;
    margin-left: 10px;
    font-weight: 900;
    cursor: pointer;
  }
`;
const Form = styled.div`
  display: flex;

  input,
  label {
    margin: 5px 20px;
    height: 25px;
    max-width: 700px;
    color: #46295a;
    font-weight: 700;
    font-size: 20px;
  }
  input {
    height: 45px;
    padding-left: 10px;
    border-radius: 20px;
    border: 1px solid #290d3c;
  }
`;
const Form1 = styled.div`
  display: flex;
  flex-direction: column;
`;
const ButaoEnvioUsuario = styled.div`
  display: flex;
  margin-top: 1.5%;
  justify-content: center;
  input {
    background-color: #46295a;
    color: #f3eef7;
    padding: 15px 50px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 20px;
    cursor: pointer;
  }
  input:hover {
    background-color: #8b43bb;
    border: none;
    transition: 1s;
  }
`;
const IconeEditavel = styled(FaPenToSquare)`
  cursor: pointer;
`;
const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [nome_usuario, setNome_Usuario] = useState("");
  const [cargo, setCargo] = useState("");
  const [senha, setSenha] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await apiAcai.get("/alluser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Secesso", res.data);
        setUsuarios(res.data);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarUsuarios();
  }, []);

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };
  const editarUsuario = async (e) => {
    e.preventDefault();

    try {
      const usuarioEditado = {
        id,
        nome_usuario,
        senha,
      };
      const token = localStorage.getItem("token");
      const res = await apiAcai.put("/user", usuarioEditado, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 201) {
        toast.success(res.data.message[0]);
        fechaModalEdi();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cadastrarUusuario = async (e) => {
    e.preventDefault();

    try {
      const usuarioCadastro = {
        id,
        nome,
        nome_usuario,
        senha,
        cargo,
      };
      const res = await apiAcai.post("/user", usuarioCadastro);
      if (res.status === 201) {
        console.log(res.data.data[0]);
        toast.success(res.data.data[0]);
        fecharModal();
      }
    } catch (error) {
      console.log("Erro", error);
      toast.error("Erro");
    }
  };
  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value);
  };

  const filtroUsuarios = pesquisa
    ? usuarios.data?.filter((usuario) => {
        return (
          usuario.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
          usuario.cargo?.toLowerCase().includes(pesquisa.toLowerCase()) ||
          usuario.usuario?.toLowerCase().includes(pesquisa.toLowerCase())
        );
      })
    : usuarios.data;

  const abrirModalEdi = (userId, nome, senha, nomeUsuario) => {
    setModalEdit(true);
    console.log("ID do usuário:", userId, nomeUsuario, senha);
    setId(userId);
    setSenha(senha);
    setNome_Usuario(nomeUsuario);
  };
  const fechaModalEdi = () => {
    setModalEdit(false);
  };

  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar />
        <ContainerFlex>
          <NavBar>
            <InputPesquisa
              type="search"
              placeholder="Digite o nome do item"
              value={pesquisa}
              onChange={handlePesquisaChange}
            />
            <InputButao type="button" onClick={abrirModal} value="+  Usuário" />
            <Modal
              isOpen={modalAberto}
              onRequestClose={fecharModal}
              contentLabel="Confirmar Pedido"
              style={{
                content: {
                  borderRadius: "15px",
                  maxWidth: "55%",
                  height: "40%",
                  margin: "auto",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                },
              }}
            >
              <ModalCadastroProduto>
                <h2 onClick={fecharModal}>X</h2>
                <h2>Cadastro de usuario</h2>
              </ModalCadastroProduto>
              <form onSubmit={(e) => cadastrarUusuario(e)}>
                <Form>
                  <Form1>
                    <label>Nome</label>
                    <input
                      type="text"
                      placeholder="Nome do Usuario"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </Form1>
                  <Form1>
                    <label>Cargo</label>
                    <input
                      type="text"
                      placeholder="Cargo do usuario"
                      value={cargo}
                      onChange={(e) => setCargo(e.target.value)}
                    />
                  </Form1>
                </Form>
                <Form>
                  <Form1>
                    <label>Usuario</label>
                    <input
                      type="text"
                      placeholder="Digite o usario de login"
                      value={nome_usuario}
                      onChange={(e) => setNome_Usuario(e.target.value)}
                    />
                  </Form1>
                  <Form1>
                    <label>Senha</label>
                    <input
                      type="password"
                      placeholder="Senha do usuario"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </Form1>
                </Form>
                <ButaoEnvioUsuario>
                  <input type="submit" value="Enviar usuario" />
                </ButaoEnvioUsuario>
              </form>
            </Modal>
          </NavBar>
          <Tabela>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Cargo</th>
                <th>Uusario</th>
                <th>Editar usuario</th>
                <th>Deletar usuario</th>
              </tr>
            </thead>
            {!filtroUsuarios || filtroUsuarios.length === 0 ? (
              <p>Nenhum usuário encontrado</p>
            ) : (
              filtroUsuarios.map((usuario) => (
                <tbody key={usuario.id}>
                  <tr>
                    <td>
                      <p>{usuario.id}</p>
                    </td>
                    <td>
                      <p>{usuario.nome}</p>
                    </td>
                    <td>
                      <p>{usuario.cargo}</p>
                    </td>
                    <td>{usuario.nome_usuario}</td>
                    <td>
                      {" "}
                      <p>
                        <IconeEditavel
                          color="#46295a"
                          onClick={() =>
                            abrirModalEdi(
                              usuario.id,
                              usuario.nome_usuario,
                              usuario.senha
                            )
                          }
                        />
                      </p>
                      <Modal
                        isOpen={modalEdit}
                        onRequestClose={fechaModalEdi}
                        contentLabel="Confirmar Pedido"
                        style={{
                          content: {
                            borderRadius: "15px",
                            maxWidth: "55%",
                            height: "40%",
                            margin: "auto",
                            padding: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          },
                        }}
                      >
                        <ModalCadastroProduto>
                          <h2 onClick={fechaModalEdi}>X</h2>
                          <h2>Editação de usuario</h2>
                        </ModalCadastroProduto>
                        <form onSubmit={(e) => editarUsuario(e)}>
                          <Form>
                            <Form1>
                              <label>ID</label>
                              <input
                                type="text"
                                placeholder="ID do Usuário"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                              />
                            </Form1>
                            <Form1>
                              <label>Usuario</label>
                              <input
                                type="text"
                                placeholder="ID do Usuário"
                                value={nome_usuario}
                                onChange={(e) =>
                                  setNome_Usuario(e.target.value)
                                }
                              />
                            </Form1>
                            <Form1>
                              <label>Senha</label>
                              <input
                                type="text"
                                placeholder="ID do Usuário"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                              />
                            </Form1>
                          </Form>
                          <ButaoEnvioUsuario>
                            <input type="submit" value="Enviar usuario" />
                          </ButaoEnvioUsuario>
                        </form>
                      </Modal>
                    </td>
                    <td>
                      <span style={{ cursor: "pointer" }}>
                        <MdDelete color="#46295a" />
                      </span>
                    </td>
                  </tr>
                </tbody>
              ))
            )}
          </Tabela>
        </ContainerFlex>
      </Flex>
    </>
  );
};

export default Usuarios;
