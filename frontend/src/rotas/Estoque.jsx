import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import agua from "../assets/img/agua.png";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";

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
  width: 83vw;
  background-color: #46295a;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 690px;
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
    border-bottom: 2px solid #d9d9d9b0;
  }
  th {
    background-color: #d9d9d9b0;
  }
  td img {
    margin-top: 10px;
    width: 35%;
  }
`;
const TdImg = styled.td`
  display: flex;
  align-items: center;
`;
const Status = styled.div`
  border-radius: 50%;
  height: 20px;
  width: 20px;
  background: red;
  margin: auto;
`;

const ModalCadastroProduto = styled.div`
  background-color: #46295a;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;

  h2 {
    font-size: 25px;
    color: #f3eef7;
    text-align: center;
    font-weight: 500;
  }
`;
const Form = styled.div`
  display: flex;

  input,
  label {
    margin: 5px 20px;
    height: 25px;
    width: 560px;
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
const ButaoEnvioProduto = styled.div`
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

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [codigo_produto, setCodigo_Produto] = useState("");
  const [codigo_personalizado, setCodigo_Personalizado] = useState("");
  const [preco_custo, setPreco_Custo] = useState("");
  const [tipo, setTipo] = useState("");
  const [data_venda, setData_Venda] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [img_produto, setImg_Produto] = useState("");
  useEffect(() => {
    const carregarEstoque = async () => {
      try {
        const res = await apiAcai.get("/estoque");
        console.log("Secesso", res.data);
        setProdutos(res.data);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarEstoque();
  }, []);

  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };
  const cadastrarProduto = async (e) => {
    e.preventDefault();

    try {
      const produtosCadastro = {
        nome,
        categoria,
        codigo_produto,
        codigo_personalizado: 1,
        preco_custo,
        tipo: 1,
        data_venda,
        quantidade,
        img_produto,
      };
      const res = await apiAcai.post("/produto", produtosCadastro);
      if (res.status === 201) {
        console.log(res);
      }
    } catch (error) {
      console.log("Erro", error);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar />
        <ContainerFlex>
          <NavBar>
            <InputPesquisa type="search" placeholder="Digite o nome do item" />
            <InputButao type="button" onClick={abrirModal} value="+  Produto" />
            <Modal
              isOpen={modalAberto}
              onRequestClose={fecharModal}
              contentLabel="Confirmar Pedido"
              style={{
                content: {
                  borderRadius: "15px",
                  width: "70%",
                  height: "50%",
                  margin: "auto",
                  padding: 0,
                },
              }}
            >
              <ModalCadastroProduto>
                <h2>Cadastro de produto</h2>
              </ModalCadastroProduto>
              <form onSubmit={(e) => cadastrarProduto(e)}>
                <Form>
                  <Form1>
                    <label>Nome</label>
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </Form1>
                  <Form1>
                    <label>Codigo</label>
                    <input
                      type="number"
                      placeholder="Codigo do produto"
                      value={codigo_produto}
                      onChange={(e) => setCodigo_Produto(e.target.value)}
                    />
                  </Form1>
                </Form>
                <Form>
                  <Form1>
                    <label>Valor de Compra</label>
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={preco_custo}
                      onChange={(e) => setPreco_Custo(e.target.value)}
                    />
                  </Form1>
                  <Form1>
                    <label>Categoria</label>
                    <input
                      type="number"
                      placeholder="Codigo do produto"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                    />
                  </Form1>
                </Form>
                <Form>
                  <Form1>
                    <label>Quantidade</label>

                    <input
                      type="number"
                      placeholder="Quantidade de produto"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                    />
                  </Form1>
                  <Form1>
                    <label>Imagem</label>
                    <input
                      type="text"
                      placeholder="Imagem do produto"
                      value={img_produto}
                      onChange={(e) => setImg_Produto(e.target.value)}
                    />
                  </Form1>
                </Form>
                <ButaoEnvioProduto>
                  <input type="submit" value="Enviar produto" />
                </ButaoEnvioProduto>
              </form>
            </Modal>
          </NavBar>
          <Tabela>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Estoque</th>
                <th>Preço</th>
              </tr>
            </thead>
            {!produtos || produtos.length === 0 ? (
              <p>Não há produtos cadastrados no momento</p>
            ) : (
              produtos.data.map((produto) => (
                <tbody key={produto.no}>
                  <tr>
                    <TdImg>
                      <img src={agua} alt={produto.nome} />
                      <p>{produto.nome}</p>
                    </TdImg>
                    <td>Líquido</td>
                    <td>
                      <Status></Status>
                    </td>
                    <td>
                      <p>{produto.quantidade}</p>
                    </td>
                    <td>R$ {produto.preco_custo}</td>
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

export default Estoque;
