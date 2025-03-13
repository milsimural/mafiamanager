import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Для перехода на следующую страницу
import styles from "./MainPage.module.css";

// Это страница интро. Она показывает картинку сезона и запускает статус бар
// Форвадит на логин


export default function MainPage() {
  const navigate = useNavigate();

  // Этот код обеспечивает проверку есть ли в кеше обои, если нет то ждем пока отобразится
  // И далее после полной загрузки запускаем статус бар
  useEffect(() => {
    const isMobile = window.innerWidth <= 768; // Проверяем, мобильное ли устройство
    const image = new Image();
    image.src = isMobile ? "/main-mob.jpg" : "/main.jpg";
  
    if (image.complete) {
      // Если изображение уже загружено
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
  
      return () => clearTimeout(timer);
    } else {
      // Ожидаем загрузки изображения
      image.onload = () => {
        const timer = setTimeout(() => {
          navigate("/login");
        }, 3000);
  
        return () => clearTimeout(timer);
      };
    }
  
    // Очистка
    return () => {
      image.onload = null;
    };
  }, [navigate]);

  return (
    <div className={styles.container}>
      <div className={styles.loadingBar}></div> {/* Индикатор загрузки */}
    </div>
  );
}
