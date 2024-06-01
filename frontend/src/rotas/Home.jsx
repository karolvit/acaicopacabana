import "../components/SideBar";
import SideBar from "../components/SideBar";
import styled, { createGlobalStyle } from "styled-components";
import imgFundo from "../assets/img/logo_sem_fundo.png";

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
const Fundo = styled.img`
  opacity: 0.5;
  margin: auto;
`;

const Home = () => {
  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar></SideBar>
        <Fundo src={imgFundo}></Fundo>
      </Flex>
    </>
  );
};

export default Home;
