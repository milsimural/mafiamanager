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
import offImage from "src/components/pages/Tournaments/off.png";
import ShortPlayerBar from "src/components/ui/PlayerBars/ShortPlayerBarComp";
import CaptainBarComp from "src/components/ui/PlayerBars/CaptainBarComp";
import ListElementComp from "src/components/ui/PlayerBars/ListElementComp";
import blueButtonImage from "src/components/pages/Tournaments/blueButton.png";
import grayButtonImage from "src/components/pages/Tournaments/grayButton.png";
import Getter from "src/components/pages/Tournaments/Getter.jsx";

function TournamentDetails({ user, logoutHandler }) {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  // Обьект турнира со всеми полями
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState(null);
  // Игроки турнира с пометкой есть ли они у конкретного юзера
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [roster, setRoster] = useState([{ noname: true }]);
  const [rosterData, setRosterData] = useState({});
  const [isOld, setIsOld] = useState(false);
  const [rawData, setRawData] = useState();

  useEffect(() => {
    axiosInstance
      .get(`/tournaments/details/${tournamentId}`)
      .then((res) => {
        setTournament(res.data);
        if (res.data.rawData) {
          setRawData(JSON.parse(res.data.rawData)); // Обновляем состояние rawData
        }
      })
      .catch((error) => console.error("Ошибка при получении турнира:", error));
  }, [navigate, tournamentId, user]);

  // Возвращает всех игроков с пометкой есть ли они у юзера или нет
  useEffect(() => {
    if (user?.isAdmin === true || user?.isModerator === true) return;
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

  useEffect(() => {
    if (!user || !tournament || !sortedPlayers || sortedPlayers.length === 0)
      return;
    if (user?.isAdmin || user?.isModerator) return;
    const fetchRoster = async () => {
      try {
        const response = await axiosInstance.get(
          `/constract/getroster/${user.id}/${tournament.id}`
        );
        const rosterPlayerId = JSON.parse(response.data.rosterPlayers);
        if (typeof rosterPlayerId !== "object") return;

        let oldRoster = [];
        for (let i = 0; i < rosterPlayerId.length; i++) {
          oldRoster.push(
            sortedPlayers.find((player) => player.id === rosterPlayerId[i])
          );
        }
        setRoster(oldRoster);
        setIsOld(true);
      } catch (error) {
        console.error("Error fetching roster:", error);
      }
    };

    fetchRoster();

    const savedRoster = rosterData.rosterPlayers;
    if (savedRoster) setRoster(JSON.parse(savedRoster));
  }, [user, tournament, sortedPlayers, rosterData.rosterPlayers]);

  async function collectRosterData() {
    if (tournament?.rosterFinish) return;
    const newRosterData = {
      userId: user.id,
      tournamentId: tournament.id,
      rosterPlayers: JSON.stringify(roster.map((player) => player.id)),
    };

    setRosterData(newRosterData);

    try {
      const response = await axiosInstance.post(
        `/constract/add/${user.id}/${tournament.id}`,
        newRosterData
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error adding roster:", error);
      alert("Error adding roster: " + error.message);
    }
  }

  async function updateRoster() {
    if (tournament?.rosterFinish) return;
    const newRosterData = {
      userId: user.id,
      tournamentId: tournament.id,
      rosterPlayers: JSON.stringify(roster.map((player) => player.id)),
    };

    try {
      const response = await axiosInstance.patch(
        `/constract/update/${user.id}/${tournament.id}`,
        newRosterData
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error adding roster:", error);
      alert("Error update roster: " + error.message);
    }
  }

  function addCaptainToRoster(playerId) {
    if (tournament?.rosterFinish) return;
    if (roster.some((rosterPlayer) => rosterPlayer.id === playerId)) return;
    const captain = sortedPlayers.find((player) => player.id === playerId);
    const newRoster = [...roster];
    newRoster[0] = captain;
    setRoster(newRoster);
  }

  function addPlayerToRoster(playerId) {
    if (!playerId) return;
    if (tournament?.rosterFinish) return;
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
    if (tournament?.rosterFinish) return;
    const newRoster = roster.filter((player) => player.id !== playerId);
    setRoster(newRoster);
  }

  function removeCaptainFromRoster() {
    if (tournament?.rosterFinish) return;
    const newRoster = [...roster];
    newRoster[0] = { noname: true };
    setRoster(newRoster);
  }

  // Получает список всех gomafiaId игроков участников турнира из rawData
  function getPlayerList() {
    if (!rawData) {
      console.log("Не загружены сырые данные");
      alert("Не загружены сырые данные");
      return;
    }
    const {
      props: {
        pageProps: {
          serverData: { games },
        },
      },
    } = rawData;

    const tablesArray = games[0]?.game.flatMap(({ table }) => table) || [];
    const gomafiaIds = tablesArray.map((player) => player.id);
    alert(`Успешно получено: ${gomafiaIds}`);
    return gomafiaIds;
  }

  async function getResults() {
    if (!rawData || !tournament) return;
    const tournamentResultWithFinal =
      rawData.props.pageProps.serverData.tournamentResultWithFinal;
    const tournamentResultWithoutFinal =
      rawData.props.pageProps.serverData.tournamentResultWithoutFinal;

    // Получение первых 10 объектов
    const selectedFromWithFinal = tournamentResultWithFinal.slice(0, 10);

    // Собираем логины из выбранных 10 объектов
    const existingLogins = new Set(
      selectedFromWithFinal.map((item) => item.login)
    );

    // Добавляем объекты из WithoutFinal, логины которых уникальны
    const uniqueFromWithoutFinal = tournamentResultWithoutFinal.filter(
      (item) => !existingLogins.has(item.login)
    );

    // Результирующий массив
    const resultArray = [...selectedFromWithFinal, ...uniqueFromWithoutFinal];

    // Теперь нам нужно сопоставить логины с игроками из БД

    const plainPlayers = resultArray.map((item) => ({
      login: item.login.toLowerCase(),
      sum: Number(item.sum) * Number(tournament.x),
      place: item.place,
    }));
    console.log("Получаем списочек");
    console.log(plainPlayers);

    let players = [];
    try {
      const tournamentPlayers = await axiosInstance.get(
        `/players/getTournamentPlayersAll/${tournament.id}`
      );
      players = tournamentPlayers.data;
      console.log("Сейчас будет Players");
      console.log(players);
    } catch (error) {
      alert("Error getting players: " + error.message);
      console.log(error);
      return;
    }

    const resultTable = plainPlayers
      .map((item) => {
        const player = players.find(
          (player) => player.nickname.toLowerCase() === item.login.toLowerCase()
        );
        if (player) {
          item.id = player.id;
          return item;
        }
        return null;
      })
      .filter((item) => item !== null); // удаление null из массива

    console.log("Это отсылается на сервак в боди");
    console.log(resultTable);

    if (!Array.isArray(resultTable)) {
      alert("Error: resultTable is not an array");
      return;
    }

    // Дальше передаем работу серверу:
    try {
      const response = await axiosInstance.patch(
        `/constract/closeRosters/${tournament.id}`,
        resultTable
      );
      console.log(response);
    } catch (error) {
      alert("Error closing rosters: " + error.message);
      console.log(error);
      return;
    }

    // Дальше - найти все ростеры этого турнира запросом

    // Вернуть сюда и посчитать прибыль в каждый ростер
    // Посчитать место в каждый ростер
    // Записать в каждый ростер - прибыль, место, кол-во игроков и isOver
  }

  // Функция возвращает response.data.players - массив игроков по списку gomafiaId
  // Возвращаеть response.data.notFoundIds - массив не найденных игроков
  // И добавляет турниру свойство playersList
  // - это массив Id игроков участников турнира переведенный в строку
  async function fetchPlayersByGomafiaIds(gomafiaIds) {
    if (!gomafiaIds) return;
    try {
      const response = await axiosInstance.post(
        "/players/getPlayersByGomafiaIds",
        {
          gomafiaIds,
        }
      );

      const players = response.data;
      setPlayers(players);
      alert(`Успешно получено: ${players.players.length} игроков`);
      console.log(players);

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
        setTournament(response2.data);
        console.log("Обновление прошло успешно:", response2.data);
        alert(
          "Успешно обновили список игроков турнира найденых по гоумафияID!"
        );
      } catch (error) {
        if (error.response) {
          console.error("Ошибка сервера:", error.response.data);
          alert(error.response.data);
        } else if (error.request) {
          console.error("Нет ответа от сервера:", error.request);
          alert(error.request);
        } else {
          console.error("Ошибка запроса:", error.message);
          alert(error.message);
        }
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      alert("Error fetching players: " + error.message);
      throw error;
    }
  }

  // Информация о турнире которую видет админ
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
      <>
        <p>
          Сейчас в турнир добавленно {playersCount} игроков из{" "}
          {tournament?.projected_count_of_participants}
        </p>
        <p>
          Турнир{" "}
          <b style={{ color: tournament?.isReady ? "green" : "red" }}>
            {tournament?.isReady ? "открыт" : "закрыт"}
          </b>
        </p>
        <p>
          Ростеры{" "}
          <b style={{ color: tournament?.rosterFinish ? "red" : "green" }}>
            {tournament?.rosterFinish ? "заблокированы" : "открыты"}
          </b>
        </p>
      </>
    );
  }

  //Функции управления состояние турнира

  async function openTournament() {
    try {
      const response = await axiosInstance.patch(
        `tournaments/update/${tournamentId}`,
        {
          isReady: true,
        }
      );
      console.log("Response:", response.data);
      setTournament(response.data);
    } catch (error) {
      console.error("Error open tournament:", error);
    }
  }

  async function closeTournament() {
    try {
      const response = await axiosInstance.patch(
        `tournaments/update/${tournamentId}`,
        {
          isReady: false,
        }
      );
      console.log("Response:", response.data);
      setTournament(response.data);
    } catch (error) {
      console.error("Error close tournament:", error);
    }
  }

  async function finishRosters() {
    try {
      const response = await axiosInstance.patch(
        `tournaments/update/${tournamentId}`,
        {
          rosterFinish: true,
        }
      );
      console.log("Response:", response.data);
      setTournament(response.data);
    } catch (error) {
      console.error("Error close tournament:", error);
    }
  }

  async function openRosters() {
    try {
      const response = await axiosInstance.patch(
        `tournaments/update/${tournamentId}`,
        {
          rosterFinish: false,
        }
      );
      console.log("Response:", response.data);
      setTournament(response.data);
    } catch (error) {
      console.error("Error close tournament:", error);
    }
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
                      key={player.id}
                      index={index}
                      player={player}
                      addPlayerToRoster={addPlayerToRoster}
                      addCaptainToRoster={addCaptainToRoster}
                    />
                  ))}
              </div>

              <div className={styles.playersListContainerNone}>
                {(() => {
                  const playersNotInTeam = sortedPlayers.filter(
                    (player) => !player.isInTeam
                  );

                  let startNumber = playersNotInTeam.length;
                  if (playersNotInTeam.length === sortedPlayers.length) {
                    startNumber = 1;
                  }

                  return playersNotInTeam.map((player, index) => (
                    <div
                      className={styles.playersListElementNone}
                      key={player.id || index}
                    >
                      <div className={styles.num}>
                        {String(startNumber + index).padStart(2, "0")}
                      </div>
                      <div className={styles.nickname}>{player.nickname}</div>
                      <div className={styles.sign}>
                        <img src={offImage} alt="Status" />
                      </div>
                    </div>
                  ));
                })()}
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
                          key={player.id}
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
                {tournament?.rosterFinish ? (
                  <button
                    className={styles.closed}
                    style={{ backgroundImage: `url(${grayButtonImage})` }}
                  >
                    Закрыто
                  </button>
                ) : (
                  <button
                    className={styles.closeTeam}
                    style={{ backgroundImage: `url(${blueButtonImage})` }}
                    onClick={isOld ? updateRoster : collectRosterData}
                  >
                    Сохранить
                  </button>
                )}
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
        <div>{TournamentInfo(tournament)}</div>
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
            <h3>Сначала загрузи сырые данные JSON</h3>
            <Getter
              setRawData={setRawData}
              tournamentId={tournamentId}
              rawData={rawData}
            />
            <p>Получить игрока не работает если не получить сырые данные</p>
            <div className={styles.managmentButtons}>
              <button
                disabled={!rawData}
                className={!rawData ? "disabled-button" : ""}
                onClick={() => fetchPlayersByGomafiaIds(getPlayerList())}
              >
                Получить игроков
              </button>
              <button onClick={() => openTournament()}>ОТКРЫТЬ турнир</button>
              <button onClick={() => closeTournament()}>ЗАКРЫТЬ турнир</button>
              <button onClick={() => finishRosters()}>
                Завершить приемку ростеров
              </button>
              <button onClick={() => openRosters()}>
                Открыть ростеры обратно
              </button>
              <button onClick={() => getResults()}>
                Получить результаты турнира
              </button>
            </div>
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
