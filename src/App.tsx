import { Box, styled } from "@mui/material";

import UploadField from "./components/UploadField/UploadField";
import Results from "./components/Results/Results";

const Body = styled(Box)({
  background: "#242424",
  height: "100svh",
  display: "flex",
  color: "white",
});

const Column = styled(Box)({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "30px",
});

const App = () => {
  return (
    <Body>
      <Column>
        <UploadField />
        <Results />
      </Column>
    </Body>
  );
};

export default App;
