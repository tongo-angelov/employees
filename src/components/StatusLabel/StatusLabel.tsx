import { useContext } from "react";

import { Typography, styled } from "@mui/material";

import { AppContext } from "../../context/AppContext";

const CenteredText = styled(Typography)({
  textAlign: "center",
});

const StatusLabel = () => {
  const {
    state: { state, error },
  } = useContext(AppContext);
  return (
    <>
      {error && <CenteredText color="red">{error}</CenteredText>}
      {state && <CenteredText> {state}</CenteredText>}
    </>
  );
};

export default StatusLabel;
