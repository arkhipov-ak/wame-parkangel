import { useState, useEffect } from "react";
import styles from "./AnaliticsTable.module.css";
import axios from "src/api/interceptors";
import { showErrorSnackbar } from "src/utils/showSnackBar";

function AnaliticsTable() {
  const [parkingData, setParkingData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("https://api.parkangel.ru/api/ad")
        .then((response) => {
          if (response.data.response) {
            setParkingData(response.data.response.ads);
          }
        })
        .catch(() =>
          showErrorSnackbar({
            message: "Не удалось получить данные таблицы",
          })
        );
    };
    fetchData();
  }, []);

  const sortedData = parkingData.sort((a, b) => {
    if (sortBy) {
      const aValue = a[sortBy.split(".")[0]][sortBy.split(".")[1]];
      const bValue = b[sortBy.split(".")[0]][sortBy.split(".")[1]];
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(sortedData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.container}>
      <div className={styles.containerTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th
                className={styles.big}
                onClick={() => handleSort("park.address")}
              >
                Адрес
              </th>
              <th onClick={() => handleSort("park.region")}>Регион</th>
              <th onClick={() => handleSort("park.coordinates")}>Координаты</th>
              <th
                className={styles.medium}
                onClick={() => handleSort("park.createdAt")}
              >
                Дата публикации
              </th>
              <th onClick={() => handleSort("park.length")}>Длина</th>
              <th onClick={() => handleSort("park.width")}>Ширина</th>
              <th onClick={() => handleSort("park.height")}>Высота</th>
              <th onClick={() => handleSort("park.priceHour")}>Цена в час</th>
              <th onClick={() => handleSort("park.priceDay")}>Цена в день</th>
              <th onClick={() => handleSort("park.priceWeek")}>
                Цена в неделю
              </th>
              <th onClick={() => handleSort("park.priceMonth")}>
                Цена в месяц
              </th>
              <th onClick={() => handleSort("user.telegram")}>
                Владелец (Telegram)
              </th>
              <th onClick={() => handleSort("user.city")}>Город владельца</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((parking) => (
              <tr key={parking.id}>
                <td>{parking.park.address ? parking.park.address : "-"}</td>
                <td className={styles.medium}>
                  {parking.park.region
                    ? parking.park.region === "moscow"
                      ? "Москва"
                      : parking.park.region === "spb"
                      ? "Санкт-Петербург"
                      : parking.park.region
                    : "-"}
                </td>
                <td>
                  {parking.park.coordinates ? parking.park.coordinates : "-"}
                </td>
                <td>{new Date(parking.park.createdAt).toLocaleString("ru")}</td>
                <td>{parking.park.length ? parking.park.length : "-"}</td>
                <td>{parking.park.width ? parking.park.width : "-"}</td>
                <td>{parking.park.height ? parking.park.height : "-"}</td>
                <td>{parking.park.priceHour ? parking.park.priceHour : "-"}</td>
                <td>{parking.park.priceDay ? parking.park.priceDay : "-"}</td>
                <td>{parking.park.priceWeek ? parking.park.priceWeek : "-"}</td>
                <td>
                  {parking.park.priceMonth ? parking.park.priceMonth : "-"}
                </td>
                <td>{parking.user.telegram ? parking.user.telegram : "-"}</td>
                <td>{parking.user.city ? parking.user.city : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        {pageNumbers.map((number) => (
          <button
            key={number}
            className={currentPage === number ? styles.active : ""}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default AnaliticsTable;
