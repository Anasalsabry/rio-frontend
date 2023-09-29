import * as React from "react";
import { Typography, Link, Container } from "@mui/material";
import { SITE_TITLE } from "@/constants";

export default function Copyright() {
  return (
    <Container sx={{ mt: "auto", mb: 4 }}>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link color="inherit">{SITE_TITLE}</Link> {new Date().getFullYear()}.
      </Typography>
    </Container>
  );
}
