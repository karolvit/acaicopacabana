import "../rotas/PDV.css";
import dinhero from "../assets/img/dinheiro.png";
import { useState, useEffect, useRef } from "react";
import apiAcai from "../axios/config";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Camera } from "react-camera-pro";
const PDV = () => {
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [dataHora, setDataHora] = useState(new Date());
  const [produtos, setProdutos] = useState([]);
  const [proximoPedido, setProximoPedido] = useState("");
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [cameraAberta, setCameraAberta] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef();

  const capturarImagem = (e) => {
    e.preventDefault();
    if (cameraRef.current) {
      try {
        const fotoCapturada = cameraRef.current.takePhoto();
        setCapturedImage(fotoCapturada);
      } catch (error) {
        console.log("Erro ao capturar", error);
      }
    }
  };
  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  const adicionarProduto = () => {
    if (produto && quantidade) {
      const novoProduto = {
        id: produtos.length + 1,
        nome: `Produto ${produto}`,
        quantidade: parseInt(quantidade),
        precoUnitario: parseInt(precoUnitario),
        total: parseInt(quantidade),
      };

      setProdutos([...produtos, novoProduto]);

      setProduto("");
      setQuantidade("");
      setPrecoUnitario("");
    }
  };

  const botaoEnvio = async (e) => {
    fecharModal();
    e.preventDefault();
    try {
      const inserirNovoPedido = {
        pedido: {
          produtos: produtos.map((item) => ({
            pedido: proximoPedido.message,
            prodno: item.id,
            valor_unit: item.precoUnitario,
            quantidade: item.quantidade,
            unino: 2,
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
      if (error.response.stats === 500) {
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

  return (
    <>
      <nav>
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
            <h2> R$ 25,00</h2>
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
                onClick={abrirModal}
              />
              <Modal
                isOpen={modalAberto}
                onRequestClose={fecharModal}
                contentLabel="Confirmar Pedido"
                style={{
                  content: {
                    width: "50%",
                    height: "10%",
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
                    <button onClick={fecharModal} className="vermelho">
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal>
              <input type="button" value="RESUMO" />
            </div>
            <div className="box-2">
              <input type="button" value="CANCELAR" id="vermelho" />
              <input type="button" value="PROCURAR PRODUTO" />
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
                  onChange={(e) => setProduto(e.target.value)}
                  value={produto}
                />
              </div>
              <div className="box-flex">
                <label>Quantidade</label>
                <input
                  type="text"
                  onChange={(e) => setQuantidade(e.target.value)}
                  value={quantidade}
                />
              </div>
              <div className="box-flex">
                <label>Valor Unit.</label>
                <input type="text" value={precoUnitario} />
              </div>
            </form>
            <form className="form-01">
              <div className="box-flex">
                <label>Descrição</label>
                <div className="flex-desc">
                  <input type="text" />
                  <input
                    className="botao-add"
                    type="button"
                    value="+   Adicionar Produto"
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
                          <img src={capturedImage} alt="Imagem Capturada" />
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
                <th className="thPDV">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id}>
                  <td className="tdPDV">{produto.nome}</td>
                  <td className="tdPDV">{produto.quantidade}</td>
                  <td className="tdPDV">R$ {produto.total.toFixed(2)}</td>
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
