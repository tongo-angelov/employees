import { ChangeEvent, useContext } from "react";

import { Box, Button, Stack, styled } from "@mui/material";

import { AppContext } from "../../context/AppContext";
import StatusLabel from "../StatusLabel/StatusLabel";

const Input = styled("input")({
  display: "none",
});

const UploadField = () => {
  const { setFile } = useContext(AppContext);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Button variant="contained" component="label">
          Upload file
          <Input accept=".csv" type="file" onChange={handleUpload} />
        </Button>
      </Stack>

      <StatusLabel />
    </Box>
  );
};

export default UploadField;
