import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./TournamentPage.module.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import { useNavigate } from "react-router-dom";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp2";

import ShortPlayerBar from "src/components/ui/PlayerBars/ShortPlayerBarComp";
import CaptainBarComp from "src/components/ui/PlayerBars/CaptainBarComp";
import ListElementComp from "src/components/ui/PlayerBars/ListElementComp";
import blueButtonImage from "src/components/pages/Tournaments/blueButton.png";
import grayButtonImage from "src/components/pages/Tournaments/grayButton.png";
import Getter from "src/components/pages/Tournaments/Getter.jsx";
import PersonalCard from "src/components/ui/PersonalCard/PersonalCard";

function TournamentDetails({ user, logoutHandler, updateUserCoins }) {
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  // Обьект турнира со всеми полями
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState(null);
  // Игроки турнира с пометкой есть ли они у конкретного юзера
  const [sortedPlayers, setSortedPlayers] = useState([]);
  const [roster, setRoster] = useState([]);
  const [rosterData, setRosterData] = useState({});
  const [isOld, setIsOld] = useState(false);
  const [rawData, setRawData] = useState();
  // Состояние для хранения текущего значения инпута
  const [valuex, setValuex] = useState();
  // Состояние для хранения сохраненного значения
  const [savedValuex, setSavedValuex] = useState();

  useEffect(() => {
    axiosInstance
      .get(`/tournaments/details/${tournamentId}`)
      .then((res) => {
        setTournament(res.data);
        setValuex(res.data.x);
        setSavedValuex(res.data.x);
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

  // Проверяет была ли заявка на турнир
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
        console.log("Заявка на турнир не была найдена:", error);
      }
    };

    fetchRoster();

    // const savedRoster = rosterData.rosterPlayers;
    // if (savedRoster) setRoster(JSON.parse(savedRoster));
  }, [user, tournament, sortedPlayers, rosterData.rosterPlayers]);

  useEffect(() => {
    // Этот эффект будет выполняться при каждом изменении roster
    console.log(`Изменение в ростере: ${JSON.stringify(roster, null, 2)}`);
  }, [roster]);

  // ПЕРВОЕ СОХРАНЕНИЕ РОСТЕРА
  async function collectRosterData() {
    if (tournament?.rosterFinish) return;
    if (isOld) {
      console.error("Ошибка повторного первого сохранения");
      alert(
        "Ошибка повторного первого сохранения. Пожалуйста ОБНОВИТЕ СТРАНИЦУ"
      );
      return;
    }
    if (roster.length < 1) {
      alert("Добавьте игроков в ростер");
      return;
    }
    const newRosterData = {
      userId: user.id,
      tournamentId: tournament.id,
      rosterPlayers: JSON.stringify(roster.map((player) => player?.id)),
    };

    // setRosterData(newRosterData);

    try {
      const response = await axiosInstance.post(
        `/constract/add/${user.id}/${tournament.id}`,
        newRosterData
      );
      setIsOld(true);
      console.log("Response первого сохранения:", response.data);
      alert("Успешно сохранено");
    } catch (error) {
      console.error("Error adding roster:", error);
      alert("Error adding roster: " + error.message);
    }
  }

  // Обработчик изменения Х

  const handleChangex = (e) => {
    setValuex(e.target.value);
  };

  // Обработчик сохранения Х

  async function updateXinTournament(value) {
    try {
      const response = await axiosInstance.patch(
        `tournaments/update/${tournamentId}`,
        {
          x: value,
        }
      );
      console.log("Response:", response.data);
      setTournament(response.data);
    } catch (error) {
      console.error("Error update X:", error);
    }
  }

  const handleSavex = () => {
    setSavedValuex(valuex);
    updateXinTournament(valuex);
    alert(`Значение сохранено: ${valuex}`);
  };

  // ОПРЕДЕЛЕНИЕ ПРИЗОВ

  async function setGifts() {
    try {
      const gifts = await axiosInstance.get(
        `constract/setGifts/${tournamentId}`
      );
      console.log(gifts.data);
      alert("Призы установлены");
    } catch (error) {
      console.error(`${error.message} при установке призов`);
      alert(`${error.message} при установке призов`);
    }
  }

  // ОБНОВЛЕНИЕ РОСТЕРА
  async function updateRoster() {
    if (tournament?.rosterFinish) return;
    if (
      roster === undefined ||
      roster.length === 0 ||
      roster === null ||
      roster[0] === undefined ||
      (roster[0] === null && roster.length === 1)
    ) {
      alert("Вы пытаетесь сохранить пустой ростер");
      return;
    }
    const newRosterData = {
      userId: user.id,
      tournamentId: tournament.id,
      rosterPlayers: JSON.stringify(roster.map((player) => player?.id)),
    };

    try {
      const response = await axiosInstance.patch(
        `/constract/update/${user.id}/${tournament.id}`,
        newRosterData
      );
      console.log("Response:", response.data);
      alert("Успешно сохранено");
    } catch (error) {
      console.error("Error adding roster:", error);
      alert("Error update roster: " + error.message);
    }
  }

  function addCaptainToRoster(playerId) {
    if (
      roster === undefined ||
      roster.length === 0 ||
      roster === null ||
      roster[0] === undefined ||
      (roster[0] === null && roster.length === 1)
    ) {
      let newRoster = [];
      const captain = sortedPlayers.find((player) => player.id === playerId);
      newRoster.push(captain);
      setRoster(newRoster);
      console.log(
        `ДОБАВИЛ КАПИТАНА В ПУСТОЙ РОСТЕР:  ${JSON.stringify(
          newRoster,
          null,
          2
        )}`
      );
    } else {
      console.log(roster);
      if (roster.some((rosterPlayer) => rosterPlayer?.id === playerId)) return;
      const captain = sortedPlayers.find((player) => player.id === playerId);
      const newRoster = [...roster];
      newRoster[0] = captain;
      setRoster(newRoster);
      console.log(`ДОБАВИЛ КАПИТАНА:  ${JSON.stringify(newRoster, null, 2)}`);
    }
  }

  function addPlayerToRoster(playerId) {
    if (!playerId) return;
    if (tournament?.rosterFinish) return;
    if (roster.length >= 7) return;
    const player = sortedPlayers.find((player) => player.id === playerId);
    if (!roster.some((rosterPlayer) => rosterPlayer?.id === playerId)) {
      let nextIndex = roster.length;
      if (nextIndex === 0) {
        nextIndex = 1;
      }
      const newRoster = [...roster];
      newRoster[nextIndex] = player;

      setRoster(newRoster);
      console.log(`ДОБАВИЛ ИГРОКА: ${JSON.stringify(newRoster, null, 2)}`);
    }
  }

  function removePlayerFromRoster(playerId) {
    if (tournament?.rosterFinish) return;
    const newRoster = roster.filter((player) => player?.id !== playerId);
    setRoster(newRoster);
    console.log(`УДАЛИЛ ИГРОКА: ${JSON.stringify(newRoster, null, 2)}`);
  }

  function removeCaptainFromRoster() {
    if (tournament?.rosterFinish) return;
    const newRoster = [...roster];
    newRoster[0] = null;
    setRoster(newRoster);

    console.log(
      `УДАЛИЛ КАПИТАНА, текущий ростер: ${JSON.stringify(newRoster, null, 2)}`
    );
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

  // Это функция для расчета изменения power
  function calculatePlayerPowerChanges(player, playersNum, s, a, b, c) {
    const place = Number(player.place);
    if (place === 1) {return 3;}
    else if (place < s) { return 2;} 
    else if (place > s && place < a) { return 1;} 
    else if (place > a && place < b) {return 0;}
    else if (place > b && place < c) { return -1;}
    else if (place > c) {return -2;}

    return 0;
  } 

  // Тут мы расчитываем результат турнира - кнопка "Получить результаты турнира"
  async function getResults() {
    if (!rawData || !tournament) return;
    // Загрузил json таблицы финала
    const tournamentResultWithFinal =
      rawData.props.pageProps.serverData.tournamentResultWithFinal;
    // Загрузил json таблицы без финала
    const tournamentResultWithoutFinal =
      rawData.props.pageProps.serverData.tournamentResultWithoutFinal;

    // Собираем логины из выбранных 10 объектов, в Set потому что он хранит только уникальные значения
    const existingLogins = new Set(
      tournamentResultWithFinal.map((item) => item.login)
    );

    // Добавляем объекты из WithoutFinal, логины которых уникальны и их нет в Set
    let uniqueFromWithoutFinal = [];

    if (tournamentResultWithoutFinal !== null) {
      uniqueFromWithoutFinal = tournamentResultWithoutFinal.filter(
        (item) => !existingLogins.has(item.login)
      );
    }

    // Результирующий массив - тут мы просто собираем данные из таблиц финала и отбора в одну, в таблице отбора финалист дублируется поэтому такой секс
    const resultArray = [
      ...tournamentResultWithFinal,
      ...uniqueFromWithoutFinal,
    ];

    // Теперь нам нужно сопоставить логины с игроками из БД
    // ВНИМАНИЕ! ТУТ ИДЕТ УМНОЖЕНИЕ НА Х .sum (баллы игрока) * x
    const plainPlayers = resultArray.map((item) => ({
      login: item.login.toLowerCase(),
      sum: Number(item.sum) * Number(tournament.x),
      place: item.place,
    }));
    console.log("Получаем списочек с уже дельтой power");
    console.log(plainPlayers);

    const playersNum = plainPlayers.length;

    // Вот тут мы будем что то делать
    // Но сначала опишем алгоритм изменения Power

    const s = playersNum / 100 * 10;
    const a = playersNum / 100 * 30;
    const b = playersNum / 100 * 50;
    const c = playersNum / 100 * 70;

    for(let i = 0; i < plainPlayers.length; i++) {
      plainPlayers[i].deltaPower = calculatePlayerPowerChanges(plainPlayers[i], playersNum, s, a, b, c);
      // Это устанавливает дату последнего турнира
      plainPlayers[i].lastTournamentDate = tournament.date_start;
      // Это создает запись для добавления в bio результата турнира в формете [1/30,..]
      plainPlayers[i].lastResults = `${plainPlayers[i].place}/${playersNum}`;
    }

    // Полаем игроков турнира из БД
    let players = [];
    try {
      const tournamentPlayers = await axiosInstance.get(
        `/players/getTournamentPlayersAll/${tournament.id}`
      );
      players = tournamentPlayers.data;
      console.log("Сейчас будет Players");
      console.log(players.length);
    } catch (error) {
      alert("Error getting players: " + error.message);
      console.log(error);
      return;
    }

    // Отправим в турнир данные о том сколько участников было
    try {
      const response = await axiosInstance.patch(
        `tournaments/updateProjected_count_of_participants/${tournamentId}`,
        {
          projected_count_of_participants: playersNum,
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error update projected_count_of_participants:", error);
    }


    // Теперь нам нужно сопоставить логины с игроками из БД
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
      .filter((item) => item !== null);
    
    console.log("Это отсылается на сервак в боди, всего игроков турнира: " + playersNum);
    console.log(resultTable);

    if (!Array.isArray(resultTable)) {
      alert("Error: resultTable is not an array");
      return;
    }

    // Обновляем данные по ростерам - кто сколько заработал, там же считается какое место кто занял.
    try {
      const response = await axiosInstance.patch(
        `/constract/setProfitAndPlaces/${tournament.id}`,
        resultTable
      );
      console.log(response);
    } catch (error) {
      alert("Error closing rosters: " + error.message);
      console.log(error);
      return;
    }
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
        <p>Сейчас в турнир добавленно {playersCount} игроков</p>
        <p>Название турнира: {tournament?.name}</p>
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
        <p>
          <b>ID турнира:</b> {tournament?.id}{" "}
        </p>
        <div></div>
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

    try {
      const responce = await axiosInstance.patch(
        `constract/closeRosters/${tournamentId}`
      );
      console.log("Response:", responce.data);
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

    try {
      const responce = await axiosInstance.patch(
        `constract/openRosters/${tournamentId}`
      );
      console.log("Response:", responce.data);
    } catch (error) {
      console.error("Error close tournament:", error);
    }
  }

  async function overRosters() {
    try {
      const response = await axiosInstance.patch(
        `constract/overRosters/${tournamentId}`
      );
      console.log("Response:", response.data);
      alert("Ростерам поставлен флаг - over");
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

    return (
      <>
        <div className={styles.flexContainer}>
          <div className={styles.leftColumn}>
            {tournament && <h1>{tournament.name}</h1>}
            <button
              onClick={() => navigate(`/tournaments/${tournamentId}/result`)}
            >
              Смотреть результаты
            </button>
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
                  const playersInTeam = sortedPlayers.filter(
                    (player) => player.isInTeam
                  );

                  let startNumber = playersInTeam.length + 1;
                  if (playersNotInTeam.length === sortedPlayers.length) {
                    startNumber = 1;
                  }

                  return playersNotInTeam.map((player, index) => (
                    <PersonalCard
                      player={player}
                      user={user}
                      updateUserCoins={updateUserCoins}
                      key={player.id || index}
                      numberEl={String(startNumber + index).padStart(2, "0")}
                    />
                  ));
                })()}
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
        <hr></hr>
        {/* Поле где можно изменить X турнира */}
        <h3 className={styles.adminH3}>
          Значение X (На сколько умножаются баллы спортсменов)
        </h3>
        <input
          type="text"
          value={valuex} // Управляемое значение
          onChange={handleChangex} // Обработчик изменений
        />
        <button onClick={handleSavex}>Сохранить</button>
        <div>
          <p>Текущее значение: {valuex}</p>
          <p>Сохраненное значение: {savedValuex}</p>
        </div>
        <hr></hr>
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
            <h3 className={styles.adminH3}>
              Сначала загрузи сырые данные JSON
            </h3>
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
              {/* Тут исходя из таблицы расчитываются результаты игроков по баллам */}
              <button onClick={() => getResults()}>
                Получить результаты турнира - определить доход
              </button>
              <button onClick={() => setGifts()}>Начислить призы</button>
              <button onClick={() => overRosters()}>
                Закончить турнир (Rosters Over)
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
                  {Array.isArray(players.notFoundIds) ? (
                    <>
                      {players.notFoundIds.length > 0 ? (
                        <>
                          {players.notFoundIds.map((id, index) => (
                            <span key={id}>
                              {id}
                              {index < players.notFoundIds.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                          <br />
                          <br />
                          ВСЕГО НЕ НАЙДЕНО: <b>{players.notFoundIds.length}</b>
                        </>
                      ) : (
                        <span>Не найдено игроков: 0</span>
                      )}
                    </>
                  ) : (
                    <span>Данные о не найденных игроках недоступны</span>
                  )}
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
  updateUserCoins: PropTypes.func.isRequired,
};

export default TournamentDetails;
