import React, { useEffect, useState } from "react";
import axiosInstance from "src/axiosInstance";
import styles from "./TournamentsPage.module";

export default function TournamentsPage() {
  const [tournamentsList, setTournamentsList] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/tournaments")
      .then((res) => {
        setTournamentsList(res.data);
      })
      .catch((error) => {
        console.error("Ошибка при получении списка турниров:", error);
      });
  }, []);

  return (
    <>
      <h1>TournamentsPage</h1>
      <div className={styles.twoCol}>
        <div className={styles.leftCol}>
          {tournamentsList.map((tournament) => (
            <div key={tournament.id} className={styles.tournamentCard}>
              <div className={styles.tournamentName}>{tournament.name}</div>
            </div>
          ))}
        </div>
        <div className={styles.rightCol}></div>
      </div>
    </>
  );
}
