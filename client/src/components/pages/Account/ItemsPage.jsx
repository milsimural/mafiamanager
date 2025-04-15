import React from 'react'
import {useState, useEffect} from 'react'
import styles from "./ItemsPage.module.css"
import axiosInstance from 'src/axiosInstance';

export default function ItemsPage({user}) {
const [userItems, setUserItems] = useState(null);

useEffect(() => {
    if(!user) return;
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
      <div>
        {userItems && userItems.map((item, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.element}><img src={`/${item.prototype.picture}`} /></div>
          </div>
        ))}
        {!userItems && <div>Загрузка...</div>}
      </div>
    </>
  )
}
