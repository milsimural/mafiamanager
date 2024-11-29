import React, { useState } from 'react';

export default function Getter({setRawData}) {
  const [jsonInput, setJsonInput] = useState('');
  const [tournamentData, setTournamentData] = useState(null);
  const [isFormVisible, setFormVisible] = useState(true);

  function handleChange(event) {
    setJsonInput(event.target.value);
  }

  function prepareTournamentData(event) {
    event.preventDefault();
    try {
      const parsedData = JSON.parse(jsonInput);
      setTournamentData(parsedData);
      setJsonInput('');
      setFormVisible(false);
      console.log('Parsed JSON:', parsedData);
    } catch (error) {
      alert('Неправильно скопированны данные - неправильный JSON');
        console.error('Invalid JSON:', error);
    }
  }

  function toggleFormVisibility() {
    setFormVisible(!isFormVisible);
  }

  return (
    <>
      <div style={{marginBottom: '40px'}}>
      {isFormVisible ? (
        <form onSubmit={prepareTournamentData}>
          <textarea
            id="textarea"
            name="textarea"
            rows="30"
            cols="80"
            value={jsonInput}
            onChange={handleChange}
          ></textarea><br />
          <input type="submit" value="Отправить" />
        </form>
      ) : (
        <div>
          <p>Данные загружены в переменную `tournamentData`.</p>
          <button onClick={toggleFormVisibility}>Открыть форму и загрузить данные по новой</button>
          <br /><br />
          <button onClick={() => setRawData(tournamentData)}>Забрать сырые данные</button>
        </div>
      )}
      </div>
      
    </>
  );
}
