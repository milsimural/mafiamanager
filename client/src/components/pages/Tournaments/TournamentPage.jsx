import React, { useState, useEffect } from 'react'
import styles from "./TournamentPage.module.css"
import { useParams } from "react-router-dom";
import axiosInstance from "src/axiosInstance";

function TournamentDetails() {
  const { tournamentId } = useParams(); 
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/tournaments/details/${tournamentId}`)
      .then((res) => setTournament(res.data))
      .catch((error) => console.error("Ошибка при получении турнира:", error));
  }, [tournamentId]);


  if (!tournament) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>{tournament.name}</h2>
      {/* Отобразите другую информацию о турнире здесь */}
    </div>
  );
}

export default TournamentDetails;

