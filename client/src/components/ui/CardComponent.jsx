import React, { useState } from "react";

export default function CardComponent({ title, content }) {
  const [show, setShow] = useState(false)
    return (
    <article>
      <h4>{title}</h4>
      <button onClick={() => setShow(!show)}>{show ? 'Скрыть' : 'Показать'}</button>
      {show && <p>{content}</p>}
      <button>Click</button>
    </article>
  );
}
