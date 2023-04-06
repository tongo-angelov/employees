import { Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Loader = () => {
  const {
    state: { state, error },
  } = useContext(AppContext);
  return (
    <>
      {error && <Typography color="red">{error}</Typography>}
      {state && <Typography> {state}</Typography>}
    </>
  );
};

export default Loader;
