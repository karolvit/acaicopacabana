import "../components/SideBar";
import SideBar from "../components/SideBar";
import styled, { createGlobalStyle } from "styled-components";

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

const Home = () => {
  return (
    <>
      <GlobalStyle />
      <Flex>
        <SideBar></SideBar>
        <table>Teste</table>
      </Flex>
    </>
  );
};

export default Home;
