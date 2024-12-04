import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import styles from "./TournamentsPage.module.css";
import { Link } from "react-router-dom";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp";
import readyButtonImage from "src/components/pages/Tournaments/ready.png";

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
    <div
      className={styles.background}
      style={{ backgroundImage: `url(${fonImage})` }}
    >
      <div className={styles.wrapper}>
        <div className={styles.nav}>
          <div className={styles.burger}>
            <BurgerMenuComp />
          </div>
          <NavigationComp user={user} logoutHandler={logoutHandler} />
        </div>

        <h1>TournamentsPage</h1>
        <div className={styles.twoCol}>
          <div className={styles.leftCol}>
            <h2>Сетка ФСМ</h2>
            <div className={styles.elementListContainer}>
              {tournamentsList.map((tournament) => (
                <div key={tournament.id} className={styles.listElement}>
                  <div className={styles.date}>{tournament.date_start}</div>

                  {tournament.isReady ? (
                    <Link
                      to={`/tournaments/${tournament.id}`}
                      className={styles.tournamentLink}
                    >
                      <div className={styles.tournamentName}>
                        {tournament.name}
                      </div>
                    </Link>
                  ) : (
                    <div className={styles.tournamentLink}>
                      <div className={styles.tournamentName}>
                        {tournament.name}
                      </div>
                    </div>
                  )}

                  <div className={styles.num}>
                    {tournament.projected_count_of_participants}
                  </div>
                  {tournament.isReady && (
                    <div className={styles.ready}>
                      <button
                        className={styles.readyButton}
                        onClick={() =>
                          handleTournamentNavigation(tournament.id)
                        }
                        style={{ backgroundImage: `url(${readyButtonImage})` }}
                      >
                        Ready
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.rightCol}></div>
        </div>
      </div>
    </div>
  );
}
