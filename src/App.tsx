import { Box } from "@mui/material";
import UploadField from "./components/UploadField/UploadField";
import Loader from "./components/Loader/Loader";
import Results from "./components/Results/Results";

const App = () => {
  return (
    <Box>
      <UploadField />
      <Loader />
      <Results />
    </Box>
  );
};

export default App;
