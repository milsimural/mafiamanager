import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    maxplayers: 0,
    cityid: 0,
  });
  const [cities, setCities] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCities = async () => {
    try {
      const res = await axiosInstance.get("/tournaments/cities");
      setCities(res.data);
    } catch (error) {
      console.error("Ошибка при получении списка городов:", error);
      alert("Не удалось загрузить города.");
    }
  };

  useEffect(() => {
    getCities();
  }, []);

  const addTournamentHandler = async (event) => {
    event.preventDefault();
    try {
      const res = await axiosInstance.post("/tournaments/add", formData);
      setTournaments([...tournaments, res.data]);
    } catch (error) {
      console.error("Ошибка при добавлении турнира:", error);
      alert("Не удалось добавить турнир.");
    }
  };

  useEffect(() => {
    axiosInstance
      .get("/tournaments/")
      .then((res) => {
        setTournaments(res.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении списка турниров:", error);
        alert("Не удалось загрузить турниры.");
      });
  }, []);
  return (
    <>
      <Container maxWidth="lg">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Турниры
          </Typography>
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <List>
              {tournaments.map((tournament) => (
                <ListItem key={tournament.id}>
                  <ListItemText primary={tournament.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h2" variant="h5">
            Добавить турнир
          </Typography>
          <form onSubmit={addTournamentHandler} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Название турнира"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Максимальное количество игроков"
              name="maxplayers"
              type="number"
              value={formData.maxplayers}
              onChange={handleChange}
            />
            <Select
              fullWidth
              label="Город"
              name="cityid"
              value={formData.cityid}
              onChange={handleChange}
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.cityname}
                </MenuItem>
              ))}
            </Select>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Добавить
            </Button>
          </form>
        </Box>
      </Container>
    </>
  );
}
