import { useEffect, useMemo, useState } from "react";
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

  const playersSorted = useMemo(() => {
    let filteredPlayers = [...players];

    // Применяем поиск по нику, если есть запрос
    if (searchQuery) {
      filteredPlayers = filteredPlayers.filter((player) =>
        player.nickname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Применяем сортировку, если выбрана
    if (selectedSort) {
      filteredPlayers.sort((a, b) => {
        if (selectedSort === "nickname") {
          return a[selectedSort].localeCompare(b[selectedSort]);
        } else {
          return b[selectedSort] - a[selectedSort];
        }
      });
    }

    return filteredPlayers;
  }, [players, selectedSort, searchQuery]);

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
    { id: 196, image: "logo-32.jpg", name: "TITAN" },
    { id: 32, image: "logo-33.jpg", name: "RE" },
    { id: 92, image: "logo-34.jpg", name: "INC" },
    { id: 121, image: "logo-35.jpg", name: "LEG" },
    { id: 49, image: "logo-35.jpg", name: "PRSP" },
    { id: 99, image: "logo-35.jpg", name: "DOMUS" },
    { id: 94, image: "logo-35.jpg", name: "TITANSPB" },
    { id: 201, image: "logo-35.jpg", name: "LEGION" },
    { id: 348, image: "logo-35.jpg", name: "VERS" },
    { id: 117, image: "logo-35.jpg", name: "ONORE" },
    { id: 130, image: "logo-35.jpg", name: "POLEMSPB" },
    { id: 66, image: "logo-35.jpg", name: "BLACKL" },
    { id: 286, image: "logo-35.jpg", name: "HSMSK" },
    { id: 50, image: "logo-35.jpg", name: "IMPEKB" },
    { id: 106, image: "logo-35.jpg", name: "RBF" },
    { id: 68, image: "logo-35.jpg", name: "MSTYLE" },
    { id: 81, image: "logo-35.jpg", name: "KULT" },
    { id: 62, image: "logo-35.jpg", name: "CAM" },
    { id: 57, image: "logo-35.jpg", name: "DS" },
    { id: 59, image: "logo-35.jpg", name: "SHER" },
    { id: 4, image: "logo-35.jpg", name: "BBB" },
    { id: 125, image: "logo-35.jpg", name: "BULLET" },
    { id: 185, image: "logo-35.jpg", name: "ГОРТЕН" },
    { id: 354, image: "logo-35.jpg", name: "CHIPENZ" },
    { id: 41, image: "logo-35.jpg", name: "CHI" },
    { id: 187, image: "logo-35.jpg", name: "GAR" },
    { id: 358, image: "logo-35.jpg", name: "CHITAM" },
    { id: 303, image: "logo-35.jpg", name: "STPERM" },
    { id: 67, image: "logo-35.jpg", name: "REDTR" },
    { id: 66, image: "logo-35.jpg", name: "BLKLIST" },
    { id: 309, image: "logo-35.jpg", name: "XCRAFT" },
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
              <BurgerMenuComp user={user} />
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
                  // <img
                  //   key={club.id}
                  //   src={club.image}
                  //   alt={club.name}
                  //   style={{
                  //     width: "100px",
                  //     height: "100px",
                  //     border:
                  //       selectedClubId === club.id ? "3px solid blue" : "none",
                  //     cursor: "pointer",
                  //   }}
                  //   onClick={() => handleClubClick(club.id)}
                  // />
                  <div
                    className={styles.clubContainer}
                    key={club.id}
                    onClick={() => handleClubClick(club.id)}
                  >
                    {club.name}
                  </div>
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
            {playersSorted.map((player) => {
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
        {/* <div className={styles.footer}>
          </div> */}
      </div>
    </>
  );
}

MagazinePage.propTypes = {
  user: PropTypes.object,
  logoutHandler: PropTypes.func.isRequired,
  updateUserCoins: PropTypes.func.isRequired,
};
