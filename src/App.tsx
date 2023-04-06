import { Box, Typography } from "@mui/material";
import UploadField from "./components/UploadField/UploadField";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Loader from "./components/Loader/Loader";

const App = () => {
  const {
    state: { state, error },
  } = useContext(AppContext);
  return (
    <Box>
      <Typography>Upload CSV File</Typography>
      <UploadField />
      <Loader />
    </Box>
  );
};

export default App;
