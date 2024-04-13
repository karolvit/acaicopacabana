import { CgArrowLeftO } from "react-icons/cg";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
const Seta = styled.div`
  cursor: pointer;
`;
("");

const SetaVoltar = () => {
  const navigate = useNavigate();

  const botaoVoltar = () => {
    navigate("/");
  };

  return (
    <IconContext.Provider
      value={{ color: "#fff", className: "global-class-name", size: "2em" }}
    >
      <Seta onClick={botaoVoltar}>
        <CgArrowLeftO />
      </Seta>
    </IconContext.Provider>
  );
};

export default SetaVoltar;
