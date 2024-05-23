import { NavLink, useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import logo from "../assets/img/logo.jpg";
import computador from "../assets/img/computador.png";
import pessoas from "../assets/img/pessoas.png";
import relatorio from "../assets/img/relatorio.png";
import estoque from "../assets/img/estoque.png";
import engrenagem from "../assets/img/engrenagem.png";
import sair from "../assets/img/sair.png";
import { logout, reset } from "../slices/authSlice.js";
import { useDispatch } from "react-redux";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const FlexContainer = styled.div`
  display: flex;
`;

const SideBarClass = styled.div`
  min-height: 100vh;
  min-width: 250px;
  background-color: #46295a;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Container1 = styled.div`
  line-height: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: 135px;
  height: 135px;
  border-radius: 50px;
  margin-bottom: 10px;
`;

const Title = styled.h1`
  font-size: 20px;
`;

const Subtitle = styled.h2`
  font-size: 16px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const SmallImage = styled.img`
  width: 65px;
  height: 65px;
  cursor: pointer;
`;
const SmallImage2 = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
`;

const Paragraph = styled.p`
  font-size: 21px;
`;

const MainContainer = styled.div`
  opacity: 0.5;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  width: 80%;
`;
const Footer = styled.div`
  margin-top: 20px;
`;
const Configuracao = styled.div`
  display: flex;
  gap: 10px;
`;

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = JSON.parse(localStorage.getItem("user"));
  const { user } = userData || {};

  const botaoLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  };

  return (
    <>
      <GlobalStyle />
      <FlexContainer>
        <SideBarClass>
          <Container1>
            <LogoImage src={logo} alt="" />
            <Title>{user && user.nome}</Title>
            <Subtitle>{user && user.cargo}</Subtitle>
          </Container1>
          <Container2>
            {user && user.adm === 1 ? (
              <>
                <Box>
                  <NavLink to="/pdv">
                    <SmallImage src={computador} alt="" />
                  </NavLink>
                  <Paragraph>PDV</Paragraph>
                </Box>
                <Box>
                  <NavLink to="/estoque">
                    <SmallImage src={estoque} alt="" />
                  </NavLink>
                  <Paragraph>Estoque</Paragraph>
                </Box>
                <Box>
                  <NavLink to="/relatorio">
                    <SmallImage src={relatorio} alt="" />
                  </NavLink>
                  <Paragraph>Relatórios</Paragraph>
                </Box>
                <Box>
                  <NavLink to="/usuarios">
                    <SmallImage src={pessoas} alt="" />
                  </NavLink>
                  <Paragraph>Usuários</Paragraph>
                </Box>
                <Box>
                  <Configuracao>
                    <NavLink to="/configuracao">
                      <SmallImage2 src={engrenagem} alt="" />
                    </NavLink>
                    <NavLink>
                      <SmallImage2 src={sair} alt="" onClick={botaoLogout} />
                    </NavLink>
                  </Configuracao>
                </Box>
              </>
            ) : (
              <>
                <Box>
                  <NavLink to="/pdv">
                    <SmallImage
                      src={computador}
                      alt=""
                      style={{ width: "80px", height: "90px" }}
                    />
                  </NavLink>
                  <Paragraph>PDV</Paragraph>
                </Box>
                <Box>
                  <NavLink>
                    <SmallImage
                      src={sair}
                      alt=""
                      onClick={botaoLogout}
                      style={{
                        width: "70px",
                        height: "70px",
                        marginTop: "20px",
                      }}
                    />
                  </NavLink>
                  <Paragraph>SAIR</Paragraph>
                </Box>
              </>
            )}
          </Container2>
          <Footer>
            <p>Versão 1.0.0</p>
          </Footer>
        </SideBarClass>
        <MainContainer></MainContainer>
      </FlexContainer>
    </>
  );
};

export default SideBar;
