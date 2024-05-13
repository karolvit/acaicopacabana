import styled, { createGlobalStyle } from "styled-components";
import SideBar from "../components/SideBar";
import imgFundo from "../assets/img/logo_sem_fundo.png";
import { useState, useEffect } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { IoIosAddCircle } from "react-icons/io";
import SetaFechar from "../components/SetaFechar";
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
  const [preco_custo, setPreco_Custo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [codigo_produto, setCodigo_Produto] = useState("");
  const [pesquisa, setPesquisa] = useState("");
  const [estoqueRed, setEstoqueRed] = useState("");
  const [estoqueYellow, setEstoqueYellow] = useState("");
  const [estoqueBlue, setEstoqueBlue] = useState("");
  const [modalAdd, setMoldalAdd] = useState(false);

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

  useEffect(() => {
    const carregandoRed = async () => {
      try {
        const res = await apiAcai.get("/red");
        console.log("Sucesso", res.data[0].val);
        setEstoqueRed(res.data[0].val);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoRed();
  }, []);

  useEffect(() => {
    const carregandoYellow = async () => {
      try {
        const res = await apiAcai.get("/yellow");
        console.log("Sucesso", res.data[0].val);
        setEstoqueYellow(res.data[0].val);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoYellow();
  }, []);
  useEffect(() => {
    const carregandoBlue = async () => {
      try {
        const res = await apiAcai.get("/blue");
        console.log("Sucesso", res.data[0].val);
        setEstoqueBlue(res.data[0].val);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregandoBlue();
  }, []);
  const valorModalAdd = (quantidade, codigo_produto) => {
    console.log("teste", quantidade, codigo_produto);
    setQuantidade(quantidade);
    setCodigo_Produto(codigo_produto);
    setMoldalAdd(true);
  };
  const adicionarEstoque = async (e) => {
    e.preventDefault();
    try {
      const produtoEditado = {
        codigo_produto,
        quantidade,
      };
      const res = await apiAcai.put("/attestoque", produtoEditado);
      if (res.status === 201) {
        toast.success(res.data.message[0]);
        fecharModalAdd();
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fecharModalAdd = () => {
    setMoldalAdd(false);
  };
  const Status = styled.div`
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin: auto;
    background: ${({ quantidade }) => {
      const red = parseInt(estoqueRed);
      const yellow = parseInt(estoqueYellow);
      const blue = parseInt(estoqueBlue);
      if (quantidade <= red) {
        return "red";
      } else if (quantidade >= blue) {
        return "green";
      } else if (quantidade > red && quantidade < blue ) {
        return "yellow";
      }
    }};
  `;

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
        preco_custo,
        tipo: 1,
        quantidade,
      };
      const res = await apiAcai.post("/produto", produtosCadastro);
      if (res.status === 201) {
        toast.success(res.data.message[0]);
        fecharModal();
      }
    } catch (error) {
      console.log("Erro", error);
    }
  };
  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value);
  };

  const filteredEstoque = pesquisa
    ? produtos.data?.filter((produto) => {
        return produto.nome?.toLowerCase().includes(pesquisa.toLowerCase());
      })
    : produtos.data;

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
            <InputButao type="button" onClick={abrirModal} value="+  Produto" />
            <Modal
              isOpen={modalAberto}
              onRequestClose={fecharModal}
              style={{
                content: {
                  borderRadius: "15px",
                  width: "70%",
                  height: "120px",
                  margin: "auto",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                },
              }}
            >
              <ModalCadastroProduto>
                <SetaFechar Click={fecharModal} />
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
                    <label>Valor de Compra</label>
                    <input
                      type="text"
                      placeholder="Nome do produto"
                      value={preco_custo}
                      onChange={(e) => setPreco_Custo(e.target.value)}
                    />
                  </Form1>
                  <Form1>
                    <label>Quantidade</label>
                    <input
                      type="number"
                      placeholder="Quantidade de produto"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
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
                <th>Numero do Produto</th>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Status</th>
                <th>Estoque</th>
                <th>Preço</th>
                <th>Adicionar Estoque</th>
              </tr>
            </thead>
            {!filteredEstoque || filteredEstoque.length === 0 ? (
              <p>Nenhum usuário encontrado</p>
            ) : (
              filteredEstoque.map((produto) => (
                <tbody key={produto.codigo_produto}>
                  <tr>
                    <td>
                      <p>{produto.codigo_produto}</p>
                    </td>
                    <td>
                      <p>{produto.nome}</p>
                    </td>
                    <td>Líquido</td>
                    <td>
                      <Status
                        quantidade={produto.quantidade}
                        estoqueRed={estoqueRed}
                        estoqueYellow={estoqueYellow}
                        estoqueBlue={estoqueBlue}
                      ></Status>
                    </td>
                    <td>
                      <p>{produto.quantidade}</p>
                    </td>
                    <td>R$ {produto.preco_custo}</td>
                    <td>
                      <IoIosAddCircle
                        onClick={() =>
                          valorModalAdd(
                            produto.quantidade,
                            produto.codigo_produto
                          )
                        }
                        color="#46295a"
                        size={30}
                        style={{ cursor: "pointer" }}
                      />
                      <Modal
                        isOpen={modalAdd}
                        onRequestClose={fecharModalAdd}
                        style={{
                          content: {
                            width: "70%",
                            height: "120px",
                            margin: "auto",
                            padding: 0,
                          },
                        }}
                      >
                        <div className="modal-mensagem">
                          <SetaFechar Click={fecharModalAdd} />
                          <h2>Adicionar Estoque</h2>
                        </div>
                        <div className="kg">
                          <label>Codigo</label>
                          <input
                            type="number"
                            onChange={(e) => {
                              setCodigo_Produto(e.target.value);
                            }}
                            value={codigo_produto}
                            disabled
                          />
                          <label>Quantidade adicionar</label>
                          <input
                            type="number"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                adicionarEstoque(e);
                              }
                            }}
                            onChange={(e) => {
                              setQuantidade(e.target.value);
                            }}
                            value={quantidade}
                          />
                        </div>
                      </Modal>
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

export default Estoque;
