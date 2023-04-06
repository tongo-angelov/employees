import { Box, Typography } from "@mui/material";
import UploadField from "./components/UploadField/UploadField";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

const App = () => {
  const { error } = useContext(AppContext);
  return (
    <Box>
      <Typography>Upload CSV File</Typography>
      <UploadField />
      {error && <Typography>{error}</Typography>}
    </Box>
  );
};

export default App;
