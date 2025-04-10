import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axiosInstance";
import UserCom from "./UserCom";

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
          <UserCom key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
}
