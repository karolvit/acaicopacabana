import "../rotas/PDV.css";
import dinhero from "../assets/img/dinheiro.png";
import { useState, useEffect, useRef } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Camera } from "react-camera-pro";
import SetaVoltar from "../components/SetaVoltar";
const PDV = () => {
  const [produto, setProduto] = useState("");
  const [unino, setUnino] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [nome, setNome] = useState("");
  const [dataHora, setDataHora] = useState(new Date());
  const [produtos, setProdutos] = useState([]);
  const [proximoPedido, setProximoPedido] = useState("");
  const navigate = useNavigate();
  const [modalConfirmacaoAberto, setModalConfirmacaoAberto] = useState(false);
  const [modalPesquisaAberto, setModalPesquisaAberto] = useState(false);
  const [cameraAberta, setCameraAberta] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [resultadoPesquisaProduto, setResultadoPesquisaProduto] = useState("");
  const [pesquisaProduto, setPesquisaProduto] = useState("");
  const [insersaoManual, setInsersaoManual] = useState(false);
  const [kgacai, setKgacai] = useState("0.00");
  const [precoacai, setPrecoAcai] = useState("");
  const [pesoBalanca, setPesoBalanca] = useState("");
  const cameraRef = useRef();
  const [modalCancelamento, setModalCancelamento] = useState(false);

  const capturarImagem = async (e) => {
    e.preventDefault();
    if (cameraRef.current) {
      try {
        const fotoCapturada = await cameraRef.current.takePhoto();
        const blob = dataURItoBlob(fotoCapturada);
        const file = new File([blob], "foto.jpg", { type: "image/jpeg" });
        setCapturedImage(file);
      } catch (error) {
        console.log("Erro ao capturar", error);
      }
    }
  };
  function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    return blob;
  }
  const abrirModalConfirmacao = () => {
    setModalConfirmacaoAberto(true);
  };

  const fecharModalConfirmacao = () => {
    setModalConfirmacaoAberto(false);
  };

  const abrirModalPesquisa = () => {
    setModalPesquisaAberto(true);
  };

  const fecharModalPesquisa = () => {
    setModalPesquisaAberto(false);
  };
  const fecharModalCancelamento = () => {
    setModalCancelamento(false);
  };
  const abrirModalCancelamento = () => {
    setModalCancelamento(true);
  };

  const adicionarProduto = () => {
    if (produto && unino) {
      const novoProduto = {
        id: produtos.length + 1,
        nome: `Codigo do produto: ${produto}, Nome do produto: ${nome}`,
        unino: parseInt(unino),
        precoUnitario: parseFloat(precoUnitario),
      };

      setProdutos([...produtos, novoProduto]);
      setNome("");
      setProduto("");
      setUnino("");
      setPrecoUnitario("");
    }
  };
  const valorTotal = () => {
    let total = 0;
    produtos.forEach((produto) => {
      total += produto.precoUnitario * produto.unino;
    });
    return total.toFixed(2);
  };
  const botaoCancelar = () => {
    setProdutos([]);
    setModalConfirmacaoAberto(false);
  };

  const botaoEnvio = async (e) => {
    console.log("Método botaoEnvio chamado");
    fecharModalConfirmacao();
    e.preventDefault();
    try {
      const inserirNovoPedido = {
        pedido: {
          produtos: produtos.map((item) => ({
            pedido: proximoPedido.message,
            prodno: item.id,
            valor_unit: item.precoUnitario,
            unino: item.unino,
            nome: item.nome,
            sta: 1,
            userno: 20,
          })),
        },
      };

      const res = await apiAcai.post("/ped", inserirNovoPedido);

      if (res.status === 200) {
        console.log("Sucesso", res.data);
        toast.success(res.data);
        navigate("/");
      }
    } catch (error) {
      if (error.response.status === 500) {
        console.log("Erro ao inserir produto no banco de dados");
      }
    }
  };

  useEffect(() => {
    const tempo = setInterval(() => setDataHora(new Date()), 1000);

    return () => {
      clearInterval(tempo);
    };
  }, []);

  useEffect(() => {
    const carregarProximoPedido = async () => {
      try {
        const res = await apiAcai.get("/nextped");
        setProximoPedido(res.data);
        setPrecoAcai(res.data.valor);
      } catch (error) {
        console.log("Erro", error);
      }
    };
    carregarProximoPedido();
  }, []);

  const abrirCamera = () => {
    setCameraAberta(true);
  };
  const enviarFoto = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("imagePath", capturedImage);

      const res = await apiAcai.post("/up", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        console.log("Imagem enviada com sucesso", res);
        setCapturedImage(null);
      }
    } catch (error) {
      console.log("Erro", error);
    }
  };
  const handlePesquisaProduto = async (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      try {
        const encodedPesquisaProduto = encodeURIComponent(pesquisaProduto);
        const res = await apiAcai.get(`/busca?nome=${encodedPesquisaProduto}`);

        setResultadoPesquisaProduto(res.data.message);
        console.log(res.data.message);
      } catch (error) {
        console.error("Erro ao encontrar produto:", error.message);
      }
    }
  };

  const handleProdutoSelecionado = (produtoSelecionado) => {
    abrirModalPesquisa(false);
    setNome(produtoSelecionado.nome);
    setPrecoUnitario(produtoSelecionado.preco_custo);
    setProduto(produtoSelecionado.codigo_produto);
    setModalPesquisaAberto(false);
    setPesquisaProduto("");
  };
  const verificarCodigoProduto = (codigo) => {
    if (parseInt(codigo) === 1) {
      setInsersaoManual(true);
      setNome("Açai");
      setUnino(1);
    }
  };
  const calculoKg = (evento) => {
    if (evento.key == "Enter") {
      let totalAcai = 0;
      totalAcai += kgacai * precoacai;
      setPrecoUnitario(totalAcai);
      setInsersaoManual(false);
      setKgacai("0.000");
    }
  };

  const carregandoBalanca = async () => {
    try {
      const res = await apiAcai.get("/peso");
      setPesoBalanca(res.data.peso);
      console.log(pesoBalanca);

      calculoBalanca();
    } catch (error) {
      console.log("Errooo", error);
    }
  };

  const calculoBalanca = () => {
    let totalAcaiBalaca = pesoBalanca * precoacai;
    setPrecoUnitario(totalAcaiBalaca);
    console.log(totalAcaiBalaca);
  };
  return (
    <>
      <nav>
        <div className="seta">
          <SetaVoltar />
        </div>
        <h1>PONTO DE VENDA</h1>
      </nav>
      <header className="pedidos">
        <div className="container-1">
          <div className="pedido-n">
            <h2>Pedido #{proximoPedido.message}</h2>
            <h2>{dataHora.toLocaleString()}</h2>
          </div>
          <div className="linha"></div>
          <div className="pedido-n-n">
            <img src={dinhero} alt="" />
            <h2>R$ {valorTotal()}</h2>
          </div>
          <div className="cliente">
            <p>CLIENTE BALCAO</p>
          </div>
          <div className="finaliza">
            <div className="box-1">
              <input
                type="button"
                value="FINALIZAR"
                id="verde"
                onClick={abrirModalConfirmacao}
              />
              <Modal
                isOpen={modalConfirmacaoAberto}
                onRequestClose={fecharModalConfirmacao}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "50%",
                    height: "120px",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <h2>Confirmação de pedido</h2>
                </div>
                <div className="container-modal">
                  <h2>Deseja confirmar a finalização do pedido?</h2>
                  <div className="btn-modal">
                    <button onClick={botaoEnvio} className="verde">
                      Confirmar
                    </button>
                    <button
                      onClick={fecharModalConfirmacao}
                      className="vermelho"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal>
              <input type="button" value="RESUMO" />
            </div>
            <div className="box-2">
              <input
                type="button"
                value="CANCELAR"
                id="vermelho"
                onClick={abrirModalCancelamento}
              />
              <Modal
                isOpen={modalCancelamento}
                onRequestClose={fecharModalCancelamento}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "50%",
                    height: "120px",
                    margin: "auto",
                    padding: 0,
                  },
                }}
              >
                <div className="modal-mensagem">
                  <h2>Confirmação de cancelamento</h2>
                </div>
                <div className="container-modal">
                  <h2>Deseja cancelar o pedido?</h2>
                  <div className="btn-modal">
                    <button onClick={botaoCancelar} className="verde">
                      Confirmar
                    </button>
                    <button
                      onClick={fecharModalCancelamento}
                      className="vermelho"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal>
              <input
                type="button"
                value="PROCURAR PRODUTO"
                onClick={abrirModalPesquisa}
              />
              <Modal
                isOpen={modalPesquisaAberto}
                onRequestClose={fecharModalPesquisa}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "60%",
                    maxHeight: "100%",
                    margin: "auto",
                    padding: 0,
                    overflowX: "auto",
                  },
                }}
              >
                <div className="modal-mensagem">
                  <h2 onClick={fecharModalPesquisa}>X</h2>
                  <h2>Digite o produto que deseja pesquisar</h2>
                </div>
                <div className="container-modal-produto">
                  <h2>Produto</h2>
                  <input
                    type="text"
                    value={pesquisaProduto}
                    onChange={(e) => {
                      setPesquisaProduto(e.target.value);
                    }}
                    onKeyPress={handlePesquisaProduto}
                  />
                </div>
                <ul className="produtos-pesquisa">
                  {resultadoPesquisaProduto &&
                    resultadoPesquisaProduto.map((produto) => (
                      <li
                        key={produto.id}
                        onClick={() => handleProdutoSelecionado(produto)}
                      >
                        {produto.nome}
                      </li>
                    ))}
                </ul>
              </Modal>
            </div>
          </div>
        </div>
        <div className="container-2">
          <div className="box-produto">
            <form className="form-01">
              <div className="box-flex">
                <label>Produto</label>
                <input
                  type="number"
                  onChange={(e) => {
                    setProduto(e.target.value);
                    verificarCodigoProduto(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handlePesquisaProduto(e);
                      handleProdutoSelecionado(e);
                    }
                  }}
                  value={produto}
                />
                <Modal
                  isOpen={insersaoManual}
                  onRequestClose={() => setInsersaoManual(false)}
                  contentLabel="Modal Produto Específico"
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
                      <label>Kg do Açai</label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setKgacai(e.target.value);
                        }}
                        onKeyPress={calculoKg}
                        value={kgacai}
                      />
                      <input
                        type="button"
                        value="+ Kg da Balança"
                        className="botao-add"
                        onClick={() => {
                          carregandoBalanca();
                        }}
                      />
                    </div>
                  </div>
                </Modal>
              </div>
              <div className="box-flex">
                <label>Quantidade</label>
                <input
                  type="number"
                  onChange={(e) => setUnino(e.target.value)}
                  value={unino}
                  required
                />
              </div>
              <div className="box-flex">
                <label>Valor Unit.</label>
                <input
                  type="number"
                  value={precoUnitario}
                  onChange={(e) => setPrecoUnitario(e.target.value)}
                  disabled
                />
              </div>
            </form>
            <form className="form-01">
              <div className="box-flex">
                <label>Descrição</label>
                <div className="flex-desc">
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled
                  />
                  <input
                    className="botao-add"
                    type="button"
                    value="+   Adicionar Produto"
                    onClick={adicionarProduto}
                  />
                  <input
                    type="button"
                    value="+   Abrir camera Foto"
                    className="botao-add"
                    onClick={abrirCamera}
                  />
                  {cameraAberta && (
                    <>
                      <Camera ref={cameraRef} />
                      <button
                        className="button-fechar"
                        onClick={capturarImagem}
                      >
                        Capturar Imagem
                      </button>
                      {capturedImage && (
                        <div className="imagem-capturada">
                          <img
                            src={URL.createObjectURL(capturedImage)}
                            alt="Imagem Capturada"
                          />
                        </div>
                      )}
                      {capturedImage && (
                        <button className="button-enviar" onClick={enviarFoto}>
                          Enviar Imagem
                        </button>
                      )}
                      <button
                        className="button-fechar"
                        onClick={() => setCameraAberta(false)}
                      >
                        Fechar Câmera
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
          <table className="tabela_pdv">
            <thead>
              <tr>
                <th className="thPDV">ITEM</th>
                <th className="thPDV">QTD</th>
                <th className="thPDV">VALOR</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td className="tdPDV">{produto.nome}</td>
                  <td className="tdPDV">{produto.unino}</td>
                  <td className="tdPDV">R$ {produto.precoUnitario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </header>

      <footer>Software Licensido pela Célebre </footer>
    </>
  );
};

export default PDV;
