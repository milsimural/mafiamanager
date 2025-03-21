import React, { useState } from 'react';
import axiosInstance from 'src/axiosInstance';

export default function PlayerRow({ player, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false); // Режим редактирования
  const [editedPlayer, setEditedPlayer] = useState({ ...player }); // Состояние для редактируемых данных

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPlayer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Обработчик отправки изменений
  const handleSubmit = async () => {
    try {
      await axiosInstance.put(`/players/${player.id}`, editedPlayer); // Отправляем изменения на сервер
      setIsEditing(false); // Выходим из режима редактирования
      onUpdate(); // Обновляем список игроков
    } catch (error) {
      console.error('Ошибка при обновлении игрока:', error);
    }
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="stars"
            value={editedPlayer.stars}
            onChange={handleChange}
          />
        ) : (
          player.stars
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="nickname"
            value={editedPlayer.nickname}
            onChange={handleChange}
          />
        ) : (
          player.nickname
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="power"
            value={editedPlayer.power}
            onChange={handleChange}
          />
        ) : (
          player.power
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="costcoins"
            value={editedPlayer.costcoins}
            onChange={handleChange}
          />
        ) : (
          player.costcoins
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="costgems"
            value={editedPlayer.costgems}
            onChange={handleChange}
          />
        ) : (
          player.costgems
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="checkbox"
            name="ismarket"
            checked={editedPlayer.ismarket}
            onChange={(e) =>
              setEditedPlayer((prev) => ({
                ...prev,
                ismarket: e.target.checked,
              }))
            }
          />
        ) : (
          player.ismarket ? 'Да' : 'Нет'
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="checkbox"
            name="isOpen"
            checked={editedPlayer.isOpen}
            onChange={(e) =>
              setEditedPlayer((prev) => ({
                ...prev,
                isOpen: e.target.checked,
              }))
            }
          />
        ) : (
          player.isOpen ? 'Да' : 'Нет'
        )}
      </td>
      <td>
        {player.Club ? `${player.Club.ticker} (${player.Club.icon})` : 'Нет клуба'}
      </td>
      <td>
        {isEditing ? (
          <button onClick={handleSubmit}>Сохранить</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Редактировать</button>
        )}
      </td>
    </tr>
  );
}