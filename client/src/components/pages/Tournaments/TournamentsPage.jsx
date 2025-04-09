import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import styles from "./TournamentsPage.module.css";
import { Link } from "react-router-dom";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp2";
import readyButtonImage from "src/components/pages/Tournaments/ready.png";
import grayImage from "src/components/pages/Tournaments/over.png";
import PropTypes from "prop-types";
import SelectComp from "src/components/ui/UtilComponents/SelectComp";

export default function TournamentsPage({ user, logoutHandler }) {
  const [tournamentsList, setTournamentsList] = useState([]);
  const [newTournament, setNewTournament] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sort, setSort] = useState("future");

  const filterTournaments = useMemo(() => {
    if (sort === "future") {
      return tournamentsList.filter((tournament) => new Date(tournament.date_end) > new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
    } else if (sort === "past") {
      return tournamentsList.filter((tournament) => new Date(tournament.date_end) < new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
    } else if (sort === "all") {
      return tournamentsList;
    }
  }, [tournamentsList, sort]);

  const startFilterTournaments = (sort) => {
    setSort(sort);
  };


  const handleUpdateXByStars = () => {
    setIsLoading(true);

    axiosInstance
      .patch("/tournaments/update-x-by-stars")
      .then((response) => {
        console.log("Статистика обновлений:", response.data.stats);
        alert("X успешно обновлен! Проверьте консоль для статистики.");
      })
      .catch((error) => {
        console.error("Ошибка при обновлении:", error);
        alert("Произошла ошибка при обновлении");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    axiosInstance
      .get("/tournaments")
      .then((res) => {
        // Сортируем турниры по дате начала (date_start)
        const sortedTournaments = res.data.tournaments.sort((a, b) => {
          const dateA = new Date(a.date_start);
          const dateB = new Date(b.date_start);
          return dateA - dateB; // Сортировка по возрастанию даты
        });

        // Устанавливаем отсортированный список турниров
        setTournamentsList(sortedTournaments);
      })
      .catch((error) => {
        console.error("Ошибка при получении списка турниров:", error);
      });
  }, []);

  const handleTournamentNavigation = (id) => {
    navigate(`/tournaments/${id}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTournament((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axiosInstance
      .post("/tournaments/add", newTournament)
      .then(() => {
        // Обновление списка турниров после добавления
        setTournamentsList((prev) => [...prev, newTournament]);
        setNewTournament({});
      })
      .catch((error) => {
        console.error("Ошибка при добавлении турнира:", error);
      });
  };

  return (
    <div
      className={styles.background}
      style={{ backgroundImage: `url(${fonImage})` }}
    >
      <div className={styles.wrapper}>
        <div className={styles.nav}>
          <div className={styles.burger}>
            <BurgerMenuComp user={user} />
          </div>
          <NavigationComp user={user} logoutHandler={logoutHandler} />
        </div>

        <h1>Турниры</h1>
        <div className={styles.mainInfo}>
          <h2>Сетка ФСМ</h2>
          <div className={styles.sort}>
          <SelectComp
              value={sort}
              onChangeFunc={startFilterTournaments}
              defaultValue={"не завершенные"}
              options={[
                { value: "future", name: "не завершенные" },
                { value: "past", name: "завершенные" },
                { value: "all", name: "все" },
              ]}
            /></div>
          <div className={styles.elementListContainer}>
            {filterTournaments.map((tournament) => (
              <div key={tournament.id} className={styles.listElement}>
                <div className={styles.date}>
                  {tournament.date_start.slice(5)}
                </div>

                <div>
                  {tournament.isReady ? (
                    <Link
                      to={`/tournaments/${tournament.id}`}
                      className={styles.tournamentLink}
                    >
                      {tournament.name}
                    </Link>
                  ) : (
                    <div className={styles.tournamentLink}>
                      {tournament.name}
                    </div>
                  )}
                </div>
                <div className={styles.num}>
                  {tournament.participants_count
                    ? tournament.participants_count
                    : ""}
                </div>
                {tournament.isReady && tournament.status !== "over" && (
                  <div className={styles.ready}>
                    <button
                      className={styles.readyButton}
                      onClick={() => handleTournamentNavigation(tournament.id)}
                      style={{ backgroundImage: `url(${readyButtonImage})` }}
                    >
                      Ready
                    </button>
                  </div>
                )}

                {tournament.isReady && tournament.status === "over" && (
                  <div className={styles.ready}>
                    <button
                      className={styles.readyButton}
                      onClick={() => handleTournamentNavigation(tournament.id)}
                      style={{ backgroundImage: `url(${grayImage})` }}
                    >
                      Over
                    </button>
                  </div>
                )}

                {!tournament.isReady && user?.isAdmin && (
                  <div className={styles.ready}>
                    <button
                      className={styles.readyButton}
                      onClick={() => handleTournamentNavigation(tournament.id)}
                      style={{ backgroundImage: `url(${readyButtonImage})` }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Условный рендеринг для admin и moderator */}
          {(user?.isAdmin || user?.isModerator) && (
            <div>
              <h2>Добавить Турнир</h2>
              <form onSubmit={handleFormSubmit} className={styles.formManage}>
                <div className={styles.formGroup}>
                  <label>Название турнира *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Введите название"
                    value={newTournament.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Gomafia ID турнира</label>
                  <input
                    type="number"
                    name="gomafiaId"
                    placeholder="Введите Gomafia ID"
                    value={newTournament.gomafiaId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Дата начала *</label>
                  <input
                    type="date"
                    name="date_start"
                    value={newTournament.date_start}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Дата окончания *</label>
                  <input
                    type="date"
                    name="date_end"
                    value={newTournament.date_end}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Город ID *</label>
                  <input
                    type="number"
                    name="cityId"
                    placeholder="Введите ID города"
                    value={newTournament.cityId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Страна ID *</label>
                  <input
                    type="number"
                    name="countryId"
                    placeholder="Введите ID страны"
                    value={newTournament.countryId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Статус</label>
                  <input
                    type="text"
                    name="status"
                    placeholder="Введите статус"
                    value={newTournament.status}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>ID главного рефери</label>
                  <input
                    type="number"
                    name="main_referee_id"
                    placeholder="Введите ID рефери"
                    value={newTournament.main_referee_id}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Количество звезд</label>
                  <input
                    type="number"
                    name="star"
                    placeholder="Введите количество звезд"
                    value={newTournament.star}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Ожидаемое количество участников *</label>
                  <input
                    type="number"
                    name="projected_count_of_participants"
                    placeholder="Введите количество участников"
                    value={newTournament.projected_count_of_participants}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>ID конфига призов</label>
                  <input
                    type="number"
                    name="giftConfigId"
                    placeholder="Введите ID конфига призов"
                    value={newTournament.giftConfigId}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Значение X</label>
                  <input
                    type="number"
                    name="x"
                    placeholder="Введите значение X"
                    value={newTournament.x}
                    onChange={handleInputChange}
                  />
                </div>
                <button type="submit">Добавить</button>
              </form>

              <button
                onClick={handleUpdateXByStars}
                disabled={isLoading}
                style={{ padding: "10px 20px", cursor: "pointer" }}
              >
                {isLoading ? "Идет обновление..." : "Обновить X по Stars"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

TournamentsPage.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func,
};
