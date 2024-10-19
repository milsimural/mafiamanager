import React, { useState } from "react";
import CardComponent from "../ui/CardComponent";
import FormComponent from "../ui/FormComponent";

const notesA = [
  { id: 1, title: "Note 1", content: "Content 1" },
  { id: 2, title: "Note 2", content: "Content 2" },
  { id: 3, title: "Note 3", content: "Content 3" },
];

export default function NotesPage() {
  
const [notes, setNotes] = useState(notesA)

const submitHandler = (title, content) => {
  const newNote = {
    id: notes.length + 1,
    title,
    content
  }
  setNotes([...notes, newNote]);
}

  return (
    <div>
      <h1>NotesPage</h1>

      <FormComponent submitHandler={submitHandler}/>

      {notes.map((note) => (
        <CardComponent
          key={note.id}
          title={note.title}
          content={note.content}
        />
      ))}
    </div>
  );
}
