import React, { useState, useEffect } from 'react'
import styles from "./TopUserResultComp.module.css"
import bigCoinImage from "src/components/files/big-coin20.png";
import bigGemsImage from "src/components/files/gems.svg";
import axiosInstance from 'src/axiosInstance';
import PropTypes from 'prop-types';


export default function TopUserResultComp({ getItemFunc, userId }) {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        if (!userId) return;

        async function takeData() {
            try {
                const rosterDetails = await getItemFunc(userId);
                
                const coins = await axiosInstance.get(`/items/giftInfo/${rosterDetails.tournamentId}/${rosterDetails.place}`)
                console.log(coins.data.coins);
                rosterDetails.coins = coins.data.coins.curPlaceCoins;
                setDetails(rosterDetails); 
                console.log("Детали ростера:", rosterDetails);
            } catch (error) {
                console.error("Ошибка при загрузке данных:", error);
                setDetails(null);
            }
        }
        
        takeData();
    }, [userId, getItemFunc]); // Добавьте зависимости

    return (
        <div className={styles.rows}>
            <div className={styles.coins}>
                <img src={bigCoinImage} alt="coin" />

             </div>
             <div className={styles.coinsText}>{details?.coins ?? "Загрузка..."}</div>
             <div className={styles.gems}>
               {details?.gems !== undefined ? <img src={bigGemsImage} alt="gem" /> : ""}
             </div>
            <div className={styles.gemsText}>{details?.gems ?? "Загрузка..."}</div>

            <div className={styles.itemsList}>
            { details?.ItemsView && Array.isArray(details.ItemsView.data) ? (
                  details.ItemsView.data.map((item, index) => (
                  <div className={styles.item} key={index}>{item.picture ? <img src={`/${item.picture}`}/> : item.id}</div>
                  ))
                ) : (
                <div></div>
                )}
            </div>
        </div>
    );
}

TopUserResultComp.PropTypes = {
    getItemFunc: PropTypes.func,
    userId: PropTypes.number,
}
