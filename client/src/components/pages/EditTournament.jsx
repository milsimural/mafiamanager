import React from "react";

export default function EditTournament({ tournamentId }) {
  return (
    <div>
      EditTournament
      <form>
        <input type="text" placeholder="название" />
        <input type="text" placeholder="макс. кол-во игроков" />
        <input type="text" placeholder="город" />
      </form>
    </div>
  );
}
