import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Snackbar, Link } from "@mui/material";

export default function AccountPage({ user }) {
  const [minicups, setMinicups] = useState([]);
  const [minicupData, setMinicupData] = useState({
    name: "",
  });

  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    axiosInstance
      .get("/minicup/")
      .then((res) => setMinicups(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setMinicupData({
      ...minicupData,
      [e.target.name]: e.target.value,
    });
  };

  const addMinicupHandler = async (event) => {
    event.preventDefault();
    if (!user?.id) handleClick();
    try {
      await axiosInstance.post("/minicup/add", minicupData);
      minicupData.userid = user?.id;
      setMinicups([...minicups, minicupData]);
    } catch (error) {
      console.error("Ошибка создания миникапа", error);
    }
  };
  const navigate = useNavigate();
  const handleNavigate = (minicupId) => {
    navigate(`/minicup/manage/${minicupId}`);
  };

  return (
    <>
      <h1>AccountPage</h1>

      <div>
        <h2>Миникапы</h2>
        <div>
          <ul>
            {minicups.map((minicup) => (
              <li key={minicup.id}>
                {minicup.name} - организатор: {minicup.userid}{" "}
                <button onClick={() => handleNavigate(minicup.id)}>
                  Управлять
                </button>
              </li>
            ))}
          </ul>
        </div>
        <h2>Создать миникап</h2>
        <div>
          <form onSubmit={addMinicupHandler} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Название"
              name="name"
              value={minicupData.name}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Создать
            </Button>
          </form>
        </div>

        <Snackbar
          open={open}
          autoHideDuration={6000} // Время отображения в миллисекундах
          onClose={handleClose}
          message="Зайдите на сайт чтобы создать миникап."
          action={
            <Button color="secondary" size="small" onClick={handleClose}>
              Закрыть
            </Button>
          }
        />
      </div>
    </>
  );
}
