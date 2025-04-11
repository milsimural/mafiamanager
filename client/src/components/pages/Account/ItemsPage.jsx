import React from 'react'
import {useState, useEffect} from 'react'
import axiosInstance from 'src/axiosInstance';

export default function ItemsPage({user}) {
const [userItems, setUserItems] = useState(null);

useEffect(() => {
    if(!user) return;
    getUserItems();
}, [user]);

function async getUserItems() {
    try {
        const res = await axiosInstance.get(`/itemInstance${user.id}`);
    setUserItems(res.data);
    } catch (error) {
        console.log(`Ошибка загрузки Items пользователя ${error}`);
    }
    
}

  return (
    <>
      
    </>
  )
}
