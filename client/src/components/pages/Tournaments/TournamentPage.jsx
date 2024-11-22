import React, { useState, useEffect } from "react";
import styles from "./TournamentPage.module.css";
import { useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";
import test from "./test.js";

function TournamentDetails({ user, logoutHandler }) {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [players, setPlayers] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/tournaments/details/${tournamentId}`)
      .then((res) => setTournament(res.data))
      .catch((error) => console.error("Ошибка при получении турнира:", error));
  }, [tournamentId]);

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
    // const gomafiaString = tablesArray.map(player => player.id).join(',');
    // const gomafiaIds = gomafiaString.split(',');
    // console.log(gomafiaIds);
    // return gomafiaIds;
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
      console.log("Players:", players);
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

  return (
    <div>
      {tournament && <h2>{tournament.name}</h2>}
      <button onClick={() => fetchPlayersByGomafiaIds(getPlayerList())}>
        Получить игроков
      </button>
      {players && (
        <>
          <h3>Участники</h3>
          <ul>
            {Array.isArray(players?.players) &&
              players.players.map((player) => (
                <li key={player.id}>{player.nickname}</li>
              ))}
          </ul>
          <h3>Не найдены</h3>
          <ul>
            {players &&
              players.notFoundIds &&
              players.notFoundIds.map((id) => <li key={id}>{id}</li>)}
          </ul>
        </>
      )}
    </div>
  );
}

export default TournamentDetails;
