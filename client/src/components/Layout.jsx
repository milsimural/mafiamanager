import React from "react";
import NavigationComp from "./ui/NavigationComp";
import { Outlet } from "react-router-dom";
import {
  Paper,
  Container,
  Typography,
  Link,
  Grid,
  CssBaseline,
} from "@mui/material";

export default function Layout({ user, logoutHandler }) {
  return (
    <React.Fragment>
      <CssBaseline />
      <NavigationComp user={user} logoutHandler={logoutHandler} />

      <Container maxWidth="lg" sx={{ marginTop: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 2 }}>
              <Outlet />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h5" gutterBottom>
                News & Updates
              </Typography>
              <Typography variant="body2" paragraph>
                Stay updated with the latest news and updates. Visit this
                section regularly for more information.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <footer
        style={{
          backgroundColor: "#f8f8f8",
          padding: "20px 0",
          marginTop: "30px",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            {"© "}
            <Link color="inherit" href="https://yourwebsite.com/">
              MyWebsite
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
          </Typography>
        </Container>
      </footer>
    </React.Fragment>
  );
}
