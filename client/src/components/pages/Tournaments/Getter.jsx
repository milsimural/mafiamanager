import React, { useState } from "react";
import PropTypes from "prop-types";
import axiosInstance from "src/axiosInstance";

export default function Getter({ setRawData, tournamentId, rawData }) {
  const [jsonInput, setJsonInput] = useState("");
  const [tournamentData, setTournamentData] = useState(null);
  const [isFormVisible, setFormVisible] = useState(true);

  function handleChange(event) {
    setJsonInput(event.target.value);
  }

  // Этот файл просто принимает весь JSON турнира и передает дальше
  async function prepareTournamentData(event) {
    event.preventDefault();
    try {
      const parsedData = JSON.parse(jsonInput);
      setTournamentData(parsedData);
      const updateTournamentData = { rawData: JSON.stringify(parsedData) };
      try {
        await axiosInstance.patch(
          `tournaments/update/${tournamentId}`,
          updateTournamentData
        );
        setJsonInput("");
      } catch (error) {
        console.log(error);
        alert(
          `Ошибка с обнолением обьекта турнира сырой датой: ${error.message}`
        );
      }

      setFormVisible(false);
      console.log("Parsed JSON:", parsedData);
    } catch (error) {
      alert("Неправильно скопированны данные - неправильный JSON");
      console.error("Invalid JSON:", error);
    }
  }

  function toggleFormVisibility() {
    setFormVisible(!isFormVisible);
  }

  return (
    <>
      <div style={{ marginBottom: "40px" }}>
        {isFormVisible ? (
          <>
            {rawData ? (
              <p>В rawData уже что то есть</p>
            ) : (
              <p>В rawData пусто</p>
            )}
            <form onSubmit={prepareTournamentData}>
              <textarea
                id="textarea"
                name="textarea"
                rows="30"
                cols="80"
                value={jsonInput}
                onChange={handleChange}
              ></textarea>
              <br />
              <input type="submit" value="Отправить" />
            </form>
          </>
        ) : (
          <div>
            <p>Данные загружены в переменную `tournamentData`.</p>
            <button onClick={toggleFormVisibility}>
              Открыть форму и загрузить данные по новой
            </button>
            {rawData ? (
              <p>В rawData уже что то есть</p>
            ) : (
              <p>В rawData пусто</p>
            )}
            <br />
            <br />
            <button onClick={() => setRawData(tournamentData)}>
              Забрать сырые данные
            </button>
          </div>
        )}
      </div>
    </>
  );
}

Getter.propTypes = {
  setRawData: PropTypes.func.isRequired,
  tournamentId: PropTypes.string,
  rawData: PropTypes.object,
};
