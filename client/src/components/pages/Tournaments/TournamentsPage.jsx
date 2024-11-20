import React, { useEffect } from 'react'

export default function TournamentsPage() {
const [tournamentsList, setTournamentsList] = useState([]);

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

  return (
    <div>TournamentsPage</div>
  )
}
