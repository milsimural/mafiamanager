import React from "react";
import { useState, useEffect } from "react";
import styles from "./ItemsPage.module.css";
import axiosInstance from "src/axiosInstance";

export default function ItemsPage({ user }) {
  const [userItems, setUserItems] = useState(null);

  useEffect(() => {
    if (!user) return;
    getUserItems();
  }, [user]);

  async function getUserItems() {
    try {
      const res = await axiosInstance.get(`/items/${user.id}`);
      setUserItems(res.data);
    } catch (error) {
      console.log(`Ошибка загрузки Items пользователя ${error}`);
    }
  }

  return (
    <>
      <div className={styles.row}>
        {userItems &&
          userItems.map((item, index) => (
            <div key={index} className={styles.element}>
              <img
                src={`/${item.prototype.picture}`}
                width="80px"
                height="80px"
              />
            </div>
          ))}
        {!userItems && (
          <div>У вас нет предметов или они еще загружаются...</div>
        )}
      </div>
    </>
  );
}
