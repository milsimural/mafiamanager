import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MinicupPage({ user }) {
  const { id } = useParams();
  const [minicup, setMinicup] = useState({});
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/minicup/manage/${id}`)
      .then((res) => setMinicup(res.data))
      .catch((err) => {
        console.log(err.message);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const editMinicupHandler = async (event) => {
    event.preventDefault();
    if (user.id !== minicup.userid) return; // написать всплываху
    try {
      await axiosInstance.put(`minicup/manage/${id}`, formData).then((res) => {
        setMinicup(res.data);
        return res.data;
      });
    } catch (error) {
      console.error("Ошибка при обновлении миникапа:", error);
      throw error;
    }
  };

  const deleteHandler = () => {
    if (user.id !== minicup.userid) return; // написать всплываху
    try {
      axiosInstance.delete(`minicup/manage/${id}`);
      navigate("/account");
    } catch (error) {
      console.error("Ошибка при удалении миникапа:", error);
      throw error;
    }
  };

  return (
    <div>
      <h1>MinicupPage</h1>
      {minicup.name ? minicup.name : "Нет доступа"}

      <form onSubmit={editMinicupHandler} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Название"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullwidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Изменить
        </Button>
      </form>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<DeleteIcon />}
        onClick={deleteHandler}
      >
        Удалить
      </Button>
    </div>
  );
}
