import styles from "src/components/pages/HomePage/HomePage.module.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return <div className={styles.container}>HomePage</div>;
}
