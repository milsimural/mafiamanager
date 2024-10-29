import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/admin/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении списка пользователей:", error);
      });
  }, []);

  return (
    <div>
      <h1>UsersPage</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
