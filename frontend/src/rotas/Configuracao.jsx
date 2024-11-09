import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { FaPenToSquare } from "react-icons/fa6";
import apiAcai from "../axios/config";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import SetaFechar from "../components/SetaFechar";
import Switch from "react-switch";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;
const Flex = styled.div`
  display: flex;
`;
const ContainerFlex = styled.div`
  background-image: url(${imgFundo});
  background-repeat: no-repeat;
  background-position: center;
`;
const IconeEditavel = styled(FaPenToSquare)`
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
    color: #46295a;
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

const Configuracao = () => {
  const [pp, setPp] = useState("");
  const [val, setVal] = useState("");
  const [modalPreco, setModalPreco] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalCupom, setModalCupom] = useState(false);
  const [valor_peso, setValor_Peso] = useState("");
  const [id, setId] = useState("");
  //const [id, setId] = useState("");
  const [estoqueRed, setEstoqueRed] = useState([]);
  const [estoqueBlue, setEstoqueBlue] = useState([]);
  //const [status, setStatus] = useState([]);
  const [modalRed, setModalRed] = useState("");
  const [modalBlue, setModalBlue] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const abrirModalCupom = () => {
    setModalCupom(true);
  };
  const fecharModalCupom = () => {
    setModalCupom(false);
  };

  const abrirModalStatus = (pp) => {
    setModalStatus(true);
    setPp(pp);
  };
  const fecharModalStatus = () => {
    setModalStatus(false);
  };
  const abrirModal = (id, val) => {
    setModalPreco(true);
    setId(id);
    setVal(val);
  };
  const fechaModal = () => {
    setModalPreco(false);
  };
  const abrirModalRed = (id, val) => {
    setModalRed(true);
    setId(id);
    setVal(val);
  };
  const fecharModalRed = () => {
    setModalRed(false);
  };
  const abrirModalBlue = (id, val) => {
    setModalBlue(true);
    setId(id);
    setVal(val);
  };
  const fecharModalBlue = () => {
    setModalBlue(false);
  };

  useEffect(() => {
    const carregarPreco = async () => {
      try {
        const res = await apiAcai.get("/acai");
        console.log(res.data[0].val);
        setVal(res.data[0].val);
      } catch (error) {
        console.log(error);
      }
    };
    carregarPreco();
  }, []);
  const alterandoEstoqueMini = async (e) => {
    e.preventDefault();
    try {
      const valoresAlterados = {
        id,
        val,
      };
      const res = await apiAcai.put("/param/estoque", valoresAlterados);

      if (res.status === 200) {
        console.log(res.data);

        fecharModalBlue();
        fecharModalRed();
        toast.success(res.data.message[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const carregandoRed = async () => {
      try {
        const res = await apiAcai.get("/red");
        setEstoqueRed(res.data);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoRed();
  }, []);
  useEffect(() => {
    const carregandoBlue = async () => {
      try {
        const res = await apiAcai.get("/blue");
        setEstoqueBlue(res.data);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoBlue();
  }, []);

  const botaoValorPeso = async () => {
    try {
      const valorPeso = {
        valor_peso,
      };
      const token = localStorage.getItem("token");
      const res = await apiAcai.put("acai", valorPeso, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success(res.data[0].val);
        fechaModal();
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const carregandoStatus = async () => {
      try {
        const res = await apiAcai.get("/lock");
        setPp(res.data.success[0].pp);
        console.log(res.data.success[0].pp);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoStatus();
  }, []);

  const alterandoLiberacao = async (e) => {
    e.preventDefault(e);
    try {
      const valorAlterado = {
        pp,
      };
      const res = await apiAcai.put("/lock", valorAlterado);

      if (res.status === 200) {
        fecharModalStatus(e);
        window.location.reload();
        toast.success("Alteração realizada");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSwitchChange = (checked) => {
    setIsChecked(checked);
    setPp(checked ? 0 : 1);
  };
  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar />
        <ContainerFlex>
          <Tabela>
            <thead>
              <tr>
                <th>ID</th>
                <th>Valor</th>
                <th>Descrição</th>
                <th>Edição</th>
              </tr>
            </thead>
            <tbody>
              {/*
              <tr>
                <td>1</td>
                <td>
                  <p>{val}</p>
                </td>
                <td>
                  <p>Produto por peso</p>
                </td>
                <td>
                  <p>
                    <IconeEditavel color="#46295a" onClick={abrirModal} />
                  </p>
                  <Modal
                    isOpen={modalPreco}
                    onRequestClose={fechaModal}
                    contentLabel="Modal Preço"
                    style={{
                      content: {
                        width: "50%",
                        height: "15%",
                        margin: "auto",
                        padding: 0,
                      },
                    }}
                  >
                    <div className="modal-mensagem">
                      <SetaFechar Click={fechaModal} />
                      <h2>Açai</h2>
                    </div>
                    <div className="kg">
                      <label>Kg do Açai</label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setValor_Peso(e.target.value);
                        }}
                        value={valor_peso || ""}
                      />
                      <input
                        type="button"
                        value="+ Preço do açai"
                        className="botao-add"
                        onClick={() => {
                          botaoValorPeso();
                        }}
                      />
                    </div>
                  </Modal>
                </td>
              </tr>
*/}
              {estoqueBlue.map((blue) => {
                return (
                  <tr key={blue.id}>
                    <td>1</td>
                    <td>{blue.val}</td>
                    <td>Valor max estoque (verde)</td>
                    <td>
                      <p>
                        <IconeEditavel
                          color="#46295a"
                          onClick={() => abrirModalBlue(blue.id, blue.val)}
                        />
                      </p>
                      <Modal
                        isOpen={modalBlue}
                        onRequestClose={fecharModalBlue}
                        contentLabel="Modal Preço"
                        style={{
                          content: {
                            width: "60%",
                            height: "20%",
                            margin: "auto",
                            padding: 0,
                          },
                        }}
                      >
                        <div className="modal-mensagem flex-config">
                          <SetaFechar Click={fecharModalBlue} />
                          <div className="kg">
                            <label>ID</label>
                            <input
                              type="number"
                              onChange={(e) => {
                                setId(e.target.value);
                              }}
                              value={id || ""}
                              disabled
                            />
                            <label>Quantidade do estoque max</label>
                            <input
                              type="number"
                              onChange={(e) => {
                                setVal(e.target.value);
                              }}
                              value={val || ""}
                            />
                            <input
                              type="button"
                              value="Atualizar estoque max"
                              className="botao-add"
                              onClick={(e) => {
                                alterandoEstoqueMini(e);
                              }}
                            />
                          </div>
                        </div>
                      </Modal>
                    </td>
                  </tr>
                );
              })}
              {estoqueRed.map((red) => {
                return (
                  <tr key={red.id}>
                    <td>{red.id}</td>
                    <td>{red.val}</td>
                    <td>Valor mínimo estoque (vermelho)</td>
                    <td>
                      <p>
                        <IconeEditavel
                          color="#46295a"
                          onClick={() => abrirModalRed(red.id, red.val)}
                        />
                      </p>
                      <Modal
                        isOpen={modalRed}
                        onRequestClose={fecharModalRed}
                        contentLabel="Modal Preço"
                        style={{
                          content: {
                            width: "62%",
                            height: "17%",
                            margin: "auto",
                            padding: 0,
                          },
                        }}
                      >
                        <div className="modal-mensagem flex-config">
                          <SetaFechar Click={fecharModalRed} />
                          <div className="kg">
                            <label>ID</label>
                            <input
                              type="text"
                              onChange={(e) => {
                                setId(e.target.value);
                              }}
                              value={id || ""}
                              disabled
                            />
                            <label>Quantidade do estoque minino</label>
                            <input
                              type="number"
                              onChange={(e) => {
                                setVal(e.target.value);
                              }}
                              value={val || ""}
                            />
                            <input
                              type="button"
                              value="Atualizar estoque minimo"
                              className="botao-add"
                              onClick={(e) => {
                                alterandoEstoqueMini(e);
                              }}
                            />
                          </div>
                        </div>
                      </Modal>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td>3</td>
                <td>
                  <p>{pp === 1 ? "Inativo" : "Ativo"}</p>
                </td>
                <td>
                  <p>Desativa/ativar venda manual</p>
                </td>
                <td>
                  <p>
                    <IconeEditavel color="#46295a" onClick={abrirModalStatus} />
                  </p>
                  <Modal
                    isOpen={modalStatus}
                    onRequestClose={fecharModalStatus}
                    contentLabel="Modal Preço"
                    style={{
                      content: {
                        width: "50%",
                        height: "15%",
                        margin: "auto",
                        padding: 0,
                      },
                    }}
                  >
                    <div className="modal-mensagem">
                      <SetaFechar Click={fecharModalStatus} />
                      <h2>Ativar/Inativar bloqueio de inserção manual</h2>
                    </div>
                    <div className="kg">
                      <label>Ativar/inativar</label>
                      <Switch
                        onChange={handleSwitchChange}
                        checked={isChecked}
                        onColor="#46295a"
                        onHandleColor="#593471"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                      />

                      <input
                        type="button"
                        value="Salvar"
                        className="botao-add"
                        onClick={(e) => {
                          alterandoLiberacao(e);
                        }}
                      />
                    </div>
                  </Modal>
                </td>
              </tr>
              {/* ------------ */}
              <tr>
                <td>4</td>
                <td>
                  <p>Ativo</p>
                </td>
                <td>
                  <p>Desativa/ativar cupom fidelidade</p>
                </td>
                <td>
                  <p>
                    <IconeEditavel color="#46295a" onClick={abrirModalCupom} />
                  </p>
                  <Modal
                    isOpen={modalCupom}
                    onRequestClose={fecharModalCupom}
                    contentLabel="Modal Preço"
                    style={{
                      content: {
                        width: "50%",
                        height: "15%",
                        margin: "auto",
                        padding: 0,
                      },
                    }}
                  >
                    <div className="modal-mensagem">
                      <SetaFechar Click={fecharModalCupom} />
                      <h2>Ativar/Inativar cupom Fidelidade</h2>
                    </div>
                    <div className="kg">
                      <label>Ativar/inativar</label>
                      <Switch
                        onChange={handleSwitchChange}
                        checked={isChecked}
                        onColor="#46295a"
                        onHandleColor="#593471"
                        handleDiameter={30}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={20}
                        width={48}
                      />

                      <input
                        type="button"
                        value="Salvar"
                        className="botao-add"
                      />
                    </div>
                  </Modal>
                </td>
              </tr>
            </tbody>
          </Tabela>
        </ContainerFlex>
      </Flex>
    </>
  );
};

export default Configuracao;
