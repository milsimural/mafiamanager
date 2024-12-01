import React, { useEffect, useState } from 'react'
import styles from './TournamentResult.module.css'
import axiosInstance from 'src/axiosInstance'

export default function TournamentResult({user, tournament, roster}) {
const [resultData, setResultData] = useState({})

    useEffect(() => {
    if(!user || !tournament || !roster) return

    async function getResultData() {
        try {
            const response = await axiosInstance.get(`tournaments/details/${tournament.id}`);
            setResultData(JSON.parse(response.data.resultTable));
        } catch (error) {
            console.error("Проблемы при загрузке данных турнира:", error);
        };
    }
    getResultData();
}, [user, tournament, roster])

// Выводем рейтинг и ростеры юзеров
  return (
    <>
    <h1>Результаты</h1>
<div className={StyleSheet.results}>
    
</div>
    </>
  )
}
