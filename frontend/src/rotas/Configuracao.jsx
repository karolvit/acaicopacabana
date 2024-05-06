import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { FaPenToSquare } from "react-icons/fa6";
import apiAcai from "../axios/config";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";

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
  const [val, setVal] = useState("");
  const [modalPreco, setModalPreco] = useState(false);
  const [valor_peso, setValor_Peso] = useState("");
  const abrirModal = () => {
    setModalPreco(true);
  };
  const fechaModal = () => {
    setModalPreco(false);
  };

  useEffect(() => {
    const carregarPreco = async () => {
      try {
        const res = await apiAcai.get("/acai");
        console.log(res.data.message[0].val);
        setVal(res.data.message[0].val);
      } catch (error) {
        console.log(error);
      }
    };
    carregarPreco();
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
        toast.success(res.data.message[0]);
        fechaModal();
      }
    } catch (error) {
      console.error(error);
    }
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
                <th>Valor</th>
                <th>Editar</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>{val}</p>
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
                        width: "40%",
                        height: "10%",
                        margin: "auto",
                        padding: 0,
                      },
                    }}
                  >
                    <div className="modal-mensagem">
                      <h2>Açai</h2>
                      <div className="kg">
                        <label>Preço do Açai</label>
                        <input
                          type="text"
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
                    </div>
                  </Modal>
                </td>
                <td>Edição do Preço do Açai</td>
              </tr>
            </tbody>
          </Tabela>
        </ContainerFlex>
      </Flex>
    </>
  );
};

export default Configuracao;
