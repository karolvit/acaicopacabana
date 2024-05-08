import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useState } from "react";
import Modal from "react-modal";
import SetaFechar from "../components/SetaFechar";
import apiAcai from "../axios/config";
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
  tr:hover {
    cursor: pointer;
    background-color: #aea2b5;
  }
`;

const Relatorio = () => {
  const [modalRelatorio, setModalRelatorio] = useState(false);
  const [modalVizualizar, setModalVizualizar] = useState(false);
  const [pedido, setPedido] = useState("");
  const [pedidoRes, setPedidoRes] = useState([]);

  const abrirModal = () => {
    setModalRelatorio(true);
  };
  const fecharModalRel = () => {
    setModalRelatorio(false);
  };
  const abriModalRel = () => {
    setModalVizualizar(true);
  };
  const fecharModal = () => {
    setModalVizualizar(false);
  };
  const relatorioPedido = async (pedido) => {
    try {
      const res = await apiAcai.get(`/lvendas?pedido=${pedido}`);
      if (res.status === 200) {
        setPedidoRes(res.data);
        fecharModal();
        abriModalRel();
      }
    } catch (error) {
      console.log(error);
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
                <th>ID</th>
                <th>Nome</th>
              </tr>
            </thead>
            <tbody>
              <tr onClick={abrirModal}>
                <td>
                  <p>55</p>
                </td>
                <td>
                  <p>Vendas</p>
                </td>
              </tr>
            </tbody>
          </Tabela>
          <Modal
            isOpen={modalRelatorio}
            onRequestClose={fecharModal}
            contentLabel="Modal Preço"
            style={{
              content: {
                width: "40%",
                height: "12%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharModal} />
              <h2>Pesquisa por pedido</h2>
            </div>
            <div className="kg">
              <label>Nº do Pedido</label>
              <input
                type="number"
                onChange={(e) => {
                  setPedido(e.target.value);
                }}
              />
              <input
                type="button"
                value="Pesquisar Produto"
                className="botao-add"
                onClick={() => {
                  relatorioPedido(pedido);
                }}
              />
            </div>
          </Modal>
          <Modal
            isOpen={modalVizualizar}
            onRequestClose={fecharModalRel}
            style={{
              content: {
                width: "50%",
                height: "30%",
                margin: "auto",
                padding: 0,
              },
            }}
          >
            <div className="modal-mensagem">
              <SetaFechar Click={fecharModalRel} />
              <h2>RESUMO</h2>
            </div>
            <table className="tabela_resumo">
              <thead>
                <tr>
                  <th className="thPDV">Pedido</th>
                  <th className="thPDV">Produto</th>
                  <th className="thPDV">Saldo</th>
                  <th className="thPDV">Valor</th>
                  <th className="thPDV">Data Venda</th>
                </tr>
              </thead>
              <tbody>
                {pedidoRes.map((pedido) => (
                  <tr key={pedido.pedido}>
                    <td className="tdPDV">{pedido.pedido}</td>
                    <td className="tdPDV">{pedido.nome}</td>
                    <td className="tdPDV">{pedido.unino}</td>
                    <td className="tdPDV">R$ {pedido.valor_unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal>
        </ContainerFlex>
      </Flex>
    </>
  );
};

export default Relatorio;
