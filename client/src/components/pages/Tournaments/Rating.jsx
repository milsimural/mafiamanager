import React, { useState, useEffect } from "react";
import axiosInstance from "src/axiosInstance";

export default function Rating() {
  const [rating, setRating] = useState([]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await axiosInstance.get("/constract/rating");
        setRating(res.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Можно добавить обработку UI для ошибки, например, показать уведомление
      }
    };

    fetchRating();
  }, []);

  const styles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    headerCell: {
      border: "1px solid #ddd",
      padding: "8px",
      backgroundColor: "#f2f2f2",
      color: "black",
      textAlign: "left",
    },
    cell: {
      border: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
    },
    alternateRow: {

    },
    h1: {
      textAlign: "center",
      marginTop: "20px",
    },
  };

  return (
    <div>
      <h1 style={styles.h1}>Рейтинг сезона 2024</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.headerCell}>Место</th>
            <th style={styles.headerCell}>Ник</th>
            <th style={styles.headerCell}>Монеты</th>
          </tr>
        </thead>
        <tbody>
          {rating?.map((item, index) => (
            <tr
              key={index}
              style={index % 2 === 0 ? styles.alternateRow : undefined}
            >
              <td style={{ ...styles.cell, textAlign: "center" }}>
                {index + 1}
              </td>
              <td style={styles.cell}>{item.userName}</td>
              <td style={styles.cell}>{item.totalProfit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
