import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "src/components/pages/Magazine/MagazinePage.module.css";
import fonImage from "src/components/files/fon-main.jpg";
import NavigationComp from "src/components/ui/Nav/NavigationComp";
import BurgerMenuComp from "src/components/ui/Nav/BurgerMenuComp2";
import ShopCard2 from "src/components/ui/Cards/ShopCard2";
import axiosInstance from "src/axiosInstance";
import SelectComp from "src/components/ui/UtilComponents/SelectComp";

export default function MagazinePage({ user, logoutHandler, updateUserCoins }) {
  const [players, setPlayers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState(null); // Хранит выбранный юзером клуб в фильтре
  const [selectedSort, setSelectedSort] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  function getSelectedPosts() {
    if (selectedSort) {
      const sortedArray = [...players].sort((a, b) => {
        if (selectedSort === "nickname") {
          return a[selectedSort].localeCompare(b[selectedSort]);
        } else {
          return b[selectedSort] - a[selectedSort];
        }
      });
      console.log(sortedArray);
      console.log(selectedSort);
      return sortedArray;
    } else {
      return players;
    }
  }

  useEffect(() => {
    if (selectedClubId) {
      axiosInstance
        .get(`/players/byClub/${selectedClubId}`)
        .then((res) => {
          setPlayers(res.data);
        })
        .catch((error) => {
          console.error("Ошибка при получении списка игроков:", error);
        });
    }
  }, [selectedClubId]);

  useEffect(() => {
    if (user && user.id) {
      axiosInstance
        .get(`/players/myteam/${user.id}`)
        .then((res) => {
          setTeamMembers(res.data);
        })
        .catch((error) => {
          console.error("Ошибка при получении списка игроков команды:", error);
        });
    }
  }, [user]);

  // Настройка local storage для хранения выбранного фильтра игроков

  const clubs = [
    { id: 196, image: "logo-32.jpg", name: "RE" },
    { id: 33, image: "logo-33.jpg", name: "PSG" },
    { id: 34, image: "logo-34.jpg", name: "FCB" },
    { id: 35, image: "logo-35.jpg", name: "BAR" },
  ];

  // Сохранить в локал настройки фильтра
  function saveSettings(filter) {
    localStorage.setItem("userFilter", JSON.stringify(filter));
    console.log("Settings saved:", filter);
  }

  // Читаем сохраненные настройки
  function readSettings() {
    const savedFilter = localStorage.getItem("userFilter");
    if (savedFilter) {
      setSelectedClubId(JSON.parse(savedFilter).clubId);
    } else {
      console.log("В LocalStorage нет сохранённых настроек");
      setSelectedClubId(196);
      saveSettings({ clubId: 196 });
    }
  }

  // Пользователь изменяет настройки фильтра
  const handleClubClick = (clubId) => {
    setSelectedClubId(clubId);
    saveSettings({ clubId: clubId });
  };

  // Один раз считываем прошлые настройки при загрузке страницы
  useEffect(() => {
    readSettings();
  });

  function buyPlayer(playerId, userId, playercostcoins) {
    if (user.coins < playercostcoins) {
      alert("Недостаточно монет");
      return;
    }
    axiosInstance
      .post(`/players/buy/${playerId}/${userId}`)
      .then((res) => {
        console.log(res.data);
        updateUserCoins(res.data);
      })
      .catch((error) => {
        const errorMessage =
          error.response && error.response.data
            ? error.response.data
            : error.message;

        alert(`Произошла ошибка при покупке игрока. ${errorMessage}`);
        console.error("Ошибка при покупке игрока:", error);
      });
  }

  const sortPosts = (sort) => {
    setSelectedSort(sort);
  };

  return (
    <>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${fonImage})` }}
      >
        <div className={styles.wrapper}>
          <div className={styles.nav}>
            <div className={styles.burger}>
              <BurgerMenuComp />
            </div>
            <NavigationComp user={user} logoutHandler={logoutHandler} />
          </div>
          <div className={styles.magazineNavigation}>
            <h1>Контракты</h1>
          </div>
          <div className={styles.subNavigation}>
            <h2>Спортсмены</h2>
          </div>
          <div>
            <div>
              <div className={styles.filter}>
                {clubs.map((club) => (
                  <img
                    key={club.id}
                    src={club.image}
                    alt={club.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      border:
                        selectedClubId === club.id ? "3px solid blue" : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => handleClubClick(club.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.sort}>
            <SelectComp
              value={selectedSort}
              onChangeFunc={sortPosts}
              defaultValue={"Сортировка по:"}
              options={[
                { value: "stars", name: "по звездности" },
                { value: "nickname", name: "по имени" },
                { value: "coinscost", name: "по цене" },
                { value: "power", name: "по power" },
              ]}
            />
          </div>

          <div className={styles.search}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
            ></input>
          </div>

          <div className={styles.players}>
            {getSelectedPosts().map((player) => {
              // Проверяем, входит ли player.id в teamMembers
              const isInTeam = teamMembers.some(
                (member) => member.playerid === player.id
              );

              return (
                <div className={styles.playerWrapper} key={player.nickname}>
                  <div className={styles.player}>
                    <ShopCard2
                      user={user}
                      player={player}
                      shop={true}
                      buyPlayer={buyPlayer}
                      isInTeam={isInTeam} // Передаем проп isInTeam
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

MagazinePage.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func.isRequired,
  updateUserCoins: PropTypes.func.isRequired,
};
