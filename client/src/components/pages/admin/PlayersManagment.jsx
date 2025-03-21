import React, { useEffect, useState } from 'react';
import axiosInstance from 'src/axiosInstance';
import PlayerRow from './PlayerRow'; // Импортируем компонент для строки игрока

export default function PlayersManagment() {
  const [players, setPlayers] = useState([]); // Состояние для хранения списка игроков
  const [clubId, setClubId] = useState(''); // Состояние для хранения clubId

  // Функция для загрузки игроков
  const fetchPlayers = async () => {
    try {
      const response = await axiosInstance.get(`/players/byClub/${clubId}`);
      setPlayers(response.data); // Обновляем состояние с игроками
    } catch (error) {
      console.error('Ошибка при загрузке игроков:', error);
    }
  };

  // Загружаем игроков при изменении clubId
  useEffect(() => {
    if (clubId) {
      fetchPlayers();
    }
  }, [clubId]);

  return (
    <div>
      <h1>Управление спортсменами</h1>
      <div>
        <label htmlFor="clubId">Введите ID клуба: </label>
        <input
          type="text"
          id="clubId"
          value={clubId}
          onChange={(e) => setClubId(e.target.value)}
        />
        <button onClick={fetchPlayers}>Загрузить игроков</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Stars</th>
            <th>Nickname</th>
            <th>Power</th>
            <th>Cost Coins</th>
            <th>Cost Gems</th>
            <th>Is Market</th>
            <th>Is Open</th>
            <th>City ID</th>
            <th>Picture</th>
            <th>Club ID</th>
            <th>Bio</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <PlayerRow key={player.id} player={player} onUpdate={fetchPlayers} />
          ))}
        </tbody>
      </table>
    </div>
  );
}