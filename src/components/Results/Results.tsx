import { useContext } from "react";

import { Box, Typography } from "@mui/material";

import { AppContext } from "../../context/AppContext";

const Results = () => {
  const { pair } = useContext(AppContext);
  return (
    <Box sx={{ marginTop: "40px" }}>
      {pair && (
        <Box>
          <Typography variant="h5">{`${pair.aID}, ${pair.bID}, ${pair.time}`}</Typography>
          {pair.projects.map((project, index) => (
            <Typography
              key={index}
              variant="h6"
            >{`${project.id}, ${project.time}`}</Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Results;
