import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./TournamentPage.module.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import { useNavigate } from "react-router-dom";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp";
import test from "./test.js";
import offImage from "src/components/pages/Tournaments/off.png";
import ShortPlayerBar from "src/components/ui/PlayerBars/ShortPlayerBarComp";
import CaptainBarComp from "src/components/ui/PlayerBars/CaptainBarComp";
import ListElementComp from "src/components/ui/PlayerBars/ListElementComp";
import blueButtonImage from "src/components/pages/Tournaments/blueButton.png";

function TournamentDetails({ user, logoutHandler }) {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState(null);
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [roster, setRoster] = useState([{ noname: true }]);

  useEffect(() => {
    axiosInstance
      .get(`/tournaments/details/${tournamentId}`)
      .then((res) => setTournament(res.data))
      .catch((error) => console.error("Ошибка при получении турнира:", error));
  }, [navigate, tournamentId, user]);

  useEffect(() => {
    async function getSortedPlayers() {
      try {
        const response = await axiosInstance.get(
          `/players/getTournamentPlayersArray/${tournamentId}/${user.id}`
        );
        setSortedPlayers(response.data);
      } catch (error) {
        console.error(
          "Ошибка при получении отсортированных игроков:",
          error.message
        );
        return null;
      }
    }

    if (tournament && user) {
      getSortedPlayers();
    }
  }, [tournament, tournamentId, user]);

  function addCaptainToRoster(playerId) {
    if (roster.some((rosterPlayer) => rosterPlayer.id === playerId)) return;
    const captain = sortedPlayers.find((player) => player.id === playerId);

    // const newRoster = [
    //   captain,
    //   ...roster.filter((player) => player.id !== playerId),
    // ];
    const newRoster = [...roster];
    newRoster[0] = captain;
    setRoster(newRoster);
  }

  function addPlayerToRoster(playerId) {
    if (!playerId) return;
    if (roster.length >= 6) return;
    const player = sortedPlayers.find((player) => player.id === playerId);
    if (!roster.some((rosterPlayer) => rosterPlayer.id === playerId)) {
      const nextIndex = roster.length;
      const newRoster = [...roster];
      newRoster[nextIndex] = player;

      setRoster(newRoster);
    }
  }

  function removePlayerFromRoster(playerId) {
    const newRoster = roster.filter((player) => player.id !== playerId);
    setRoster(newRoster);
  }

  function removeCaptainFromRoster(playerId) {
    const newRoster = [...roster];
    newRoster[0] = { noname: true };
    setRoster(newRoster);
  }

  function getPlayerList() {
    const {
      props: {
        pageProps: {
          serverData: { games },
        },
      },
    } = test;

    const tablesArray = games[0]?.game.flatMap(({ table }) => table) || [];
    const gomafiaIds = tablesArray.map((player) => player.id);
    return gomafiaIds;
  }

  async function fetchPlayersByGomafiaIds(gomafiaIds) {
    try {
      const response = await axiosInstance.post(
        "/players/getPlayersByGomafiaIds",
        {
          gomafiaIds,
        }
      );

      const players = response.data;
      setPlayers(players);

      const playersIdsForTournamentUpdate = players.players.map(
        (player) => player.id
      );

      try {
        const response2 = await axiosInstance.patch(
          `/tournaments/update/${tournamentId}`,
          {
            playersList: JSON.stringify(playersIdsForTournamentUpdate),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Обновление прошло успешно:", response2.data);
        alert("Обновление прошло успешно!");
      } catch (error) {
        if (error.response) {
          console.error("Ошибка сервера:", error.response.data);
        } else if (error.request) {
          console.error("Нет ответа от сервера:", error.request);
        } else {
          console.error("Ошибка запроса:", error.message);
        }
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      throw error;
    }
  }

  function TournamentInfo(tournament) {
    // Парсим строку playersList в массив
    let playersCount = 0;
    if (tournament?.playersList) {
      try {
        const playersArray = JSON.parse(tournament.playersList);
        playersCount = playersArray.length;
      } catch (error) {
        console.error("Ошибка при парсинге playersList:", error);
      }
    }

    return (
      <p>
        Сейчас в турнир добавленно {playersCount} игроков из{" "}
        {tournament?.projected_count_of_participants}
      </p>
    );
  }

  function ShowTournamentUI() {
    if (!user) {
      // Если пользователь не определён, отображаем предложение залогиниться
      return (
        <div className={styles.loginPrompt}>
          <h2>Вы не авторизованы</h2>
          <p>
            Пожалуйста, <Link to="/login">войдите</Link>, чтобы просматривать
            информацию о турнире.
          </p>
        </div>
      );
    }

    // Тут нужно получить массив игроков играющих турнир которые есть в базе
    // +
    // Тут нужно пометить каждого который есть у юзера
    // Берем все данные из состояния

    if (
      sortedPlayers.length === 0 ||
      sortedPlayers === undefined ||
      sortedPlayers === null
    ) {
      return <div>На данный момент данных о турнире нет.</div>;
    }

    // Далее нужно отобразить количество "Неизвестных участников"
    const uncknownPlayersCount =
      tournament.projected_count_of_participants - sortedPlayers.length;

    return (
      <>
        <div className={styles.flexContainer}>
          <div className={styles.leftColumn}>
            {tournament && <h1>{tournament.name}</h1>}
            <h2>Состав участников</h2>
            <div className={styles.playersMainContainer}>
              <div className={styles.playersListContainer}>
                {sortedPlayers
                  .filter((player) => player.isInTeam) // Фильтруем игроков по isInTeam
                  .map((player, index) => (
                    <ListElementComp
                      key={index}
                      index={index}
                      player={player}
                      addPlayerToRoster={addPlayerToRoster}
                      addCaptainToRoster={addCaptainToRoster}
                    />
                  ))}
              </div>

              <div className={styles.playersListContainerNone}>
                {sortedPlayers
                  .filter((player) => player.isInTeam === false)
                  .map((player, index) => (
                    <div
                      className={styles.playersListElementNone}
                      key={player.id || index}
                    >
                      <div className={styles.num}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className={styles.nickname}>{player.nickname}</div>
                      <div className={styles.sign}>
                        <img src={offImage} alt="Status" />
                      </div>
                    </div>
                  ))}
              </div>

              <div className={styles.uncknownPlayersCount}>
                {uncknownPlayersCount} неизвестных системе участников...
              </div>
            </div>
          </div>
          <div className={styles.rightColumn}>
            <div className={styles.rightContainer}>
              <div className={styles.myteam}>
                <h2>Выставляю</h2>
                <div className={styles.wrapMT}>
                  <div className={styles.leftMT}>
                    <CaptainBarComp
                      captain={roster[0]}
                      removeCaptainFromRoster={removeCaptainFromRoster}
                    />
                  </div>
                  <div className={styles.rightMT}>
                    <div className={styles.teamListContainer}>
                      {roster.slice(1).map((player, index) => (
                        <ShortPlayerBar
                          num={index + 2} // num должен стартовать с 2, как указано
                          key={player.id || index} // Используйте player.id для уникальных ключей, если доступно
                          player={player}
                          remover={removePlayerFromRoster}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.coeffText}>Коэффициент призовых</div>
                <div className={styles.coeffNum}>100%</div>
                <div className={styles.coeffDesc}>
                  Состав вашей команды не влияет на коэффициент призовых.
                </div>
                <div className={styles.coeffResult}>Призовые стандартные.</div>
              </div>
              <div className={styles.buttonPlacer}>
                <button
                  className={styles.closeTeam}
                  style={{ backgroundImage: `url(${blueButtonImage})` }}
                >
                  Подтвердить
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function ShowEngineUI() {
    return (
      <div>
        <h2>Здравствуйте {user?.isAdmin ? "администратор" : "модератор"}</h2>
        <p className={styles.adminText}>
          Вы вошли как {user?.email} - у вас есть право редактировать турнир.{" "}
          <button onClick={() => logoutHandler()}>Выйти из аккаунта</button>
        </p>
        <p>{TournamentInfo(tournament)}</p>
        {(user?.isAdmin === true || user?.isModerator === true) && (
          <div className={styles.adminPanel}>
            <p className={styles.adminText}>
              Еси вы первый раз создаете этот турнир или настраиваете его первый
              раз - нажмите кнопку &quot;получить игроков&quot;. С ее помощью вы
              свяжете игроков из таблицы на gomafia с игроками созданными в
              системе. В таблице турнира сохранится массив связанных игроков в
              виде {"[1,2,3]"}. После чего пользователи могут задействовать этих
              игроков для констрактед режима если они у них есть.
            </p>
            <p className={styles.adminText}>
              Если что - эту кнопку можно жать хоть сколько раз подряд, только
              сначала дождитесь пока отработает - должно появиться сообщение что
              она отраболтала. Она будет обновлять связи между игроками гоумафии
              и игроками в системе.
            </p>
            <button onClick={() => fetchPlayersByGomafiaIds(getPlayerList())}>
              Получить игроков
            </button>
            {players && (
              <>
                <h3>Участники найденные</h3>
                <p className={styles.adminText}>
                  Это те игроки которые успешно связанны с базой в игре. Значит
                  они в игре есть.{" "}
                </p>
                <ul>
                  {Array.isArray(players?.players) &&
                    players.players.map((player) => (
                      <li key={player.id}>{player.nickname}</li>
                    ))}
                </ul>
                <h3>Не найдены в базе (нужно добавить)</h3>
                <p className={styles.adminText}>
                  Это те игроки которые не удалось связать с базой в игре.
                  Значит их либо нет в игре и надо их добавить, либо какая то
                  херня, либо мы пока их сознательно не добавляем. Тут
                  перечисленны ID на gomafia. Это значит что можно подставить в
                  эту ссылу этот ID вместо &quot;1&quot;:
                  https://gomafia.pro/stats/1
                </p>
                <div className={styles.adminText}>
                  {players.notFoundIds?.map((id) => (
                    <span key={id}>{id}, </span>
                  ))}
                  <br />
                  <br />
                  ВСЕГО НЕ НАЙДЕННО: <b>{players.notFoundIds?.length}</b>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  }

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

        {!user?.isAdmin && !user?.isModerator
          ? ShowTournamentUI()
          : ShowEngineUI()}
      </div>
    </div>
  );
}

TournamentDetails.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func.isRequired,
};

export default TournamentDetails;
