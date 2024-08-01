import { IoIosCloseCircle } from "react-icons/io";
import PropTypes from "prop-types";

const SetaFechar = ({ Click }) => {
  return (
    <div>
      <IoIosCloseCircle
        color="white"
        size={30}
        onClick={Click}
        style={{ margin: 5, cursor: "pointer" }}
      />
    </div>
  );
};
SetaFechar.propTypes = {
  Click: PropTypes.func.isRequired,
};

export default SetaFechar;
