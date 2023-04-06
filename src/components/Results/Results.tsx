import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Results = () => {
  const { pair } = useContext(AppContext);
  return (
    <Box>
      {pair && (
        <Typography>{`${pair.aID}, ${pair.bID}, ${pair.time}`}</Typography>
      )}
    </Box>
  );
};

export default Results;
