import React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const Loading = ({ open }) => {
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={(e) => e.preventDefault()}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Loading;
