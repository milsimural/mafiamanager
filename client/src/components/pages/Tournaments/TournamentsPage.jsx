import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import styles from "./TournamentsPage.module.css";
import { Link } from "react-router-dom";

export default function TournamentsPage({ user, logoutHandler }) {
  const [tournamentsList, setTournamentsList] = useState([]);
  const navigate = useNavigate();

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

  const handleTournamentNavigation = (id) => {
    navigate(`/tournaments/${id}`);
  };

  return (
    <>
      <h1>TournamentsPage</h1>
      <div className={styles.twoCol}>
        <div className={styles.leftCol}>
          {tournamentsList.map((tournament) => (
            <div key={tournament.id} className={styles.tournamentCard}>
              <div className={styles.date}>{tournament.date_start}</div>
              <Link
                to={`/tournaments/${tournament.id}`}
                className={styles.tournamentLink}
              >
                <div className={styles.tournamentName}>{tournament.name}</div>
              </Link>
              <div className={styles.projectedCount}>
                {tournament.projected_count_of_participants}
              </div>
              {tournament.isReady && (
                <div className={styles.ready}>
                  <button
                    onClick={() => handleTournamentNavigation(tournament.id)}
                  >
                    Ready
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.rightCol}></div>
      </div>
    </>
  );
}
