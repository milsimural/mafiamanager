import React, { useState } from "react";

export default function FormComponent({ submitHandler }) {
  const [form, setForm] = useState({ title: "", content: "" });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submitHandler(form.title, form.content);
        setForm({ title: "", content: "" });
      }}
    >
      <input
        value={form.title}
        name="title"
        type="text"
        placeholder="Введите заголовок"
        onChange={changeHandler}
      />
      <textarea
        value={form.content}
        name="content"
        id=""
        placeholder="Текст заметки"
        onChange={changeHandler}
      />
      <button>Добавить заметку</button>
    </form>
  );
}
