import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'src/api/interceptors';
import navigationDark from 'src/assets/navigation-black.svg';
import navigation from 'src/assets/navigation.svg';
import NavBar from 'src/components/NavBar';
import { state } from 'src/state';
import { API_KEY } from 'src/utils/constants';
import { showErrorSnackbar } from 'src/utils/showSnackBar';
import { useSnapshot } from 'valtio';

import styles from './ChooseMap.module.css';

const ChooseMap = () => {
  const snap = useSnapshot(state);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectAnotherButton, setSelectAnotherButton] = useState(false);
  const [watchMe, setWatchMe] = useState(false);
  const [defaultCoords, setDefaultCoords] = useState([55.755864, 37.617698]); // Default to Moscow coordinates
  const navigate = useNavigate();

  // Define bounds for Saint Petersburg and Moscow areas
  const saintPetersburgBounds = [
    [59.7245, 30.0304], // Southwest corner
    [60.0982, 30.5834], // Northeast corner
  ];

  const moscowBounds = [
    [55.4894, 36.6967], // Southwest corner
    [56.0097, 37.9456], // Northeast corner
  ];

  const handleAnotherAddressClick = () => {
    setWatchMe(false);
    setDefaultCoords(null);
    setSelectedLocation(null);
    setSelectedAddress('');
    setSelectAnotherButton(false);
  };

  const handleMapClick = async (e) => {
    let coords = e.get('coords').reverse();

    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&geocode=${coords.join(',')}&format=json`
      );

      const address =
        response.data.response.GeoObjectCollection.featureMember[0].GeoObject
          .metaDataProperty.GeocoderMetaData.text;

      setSelectedAddress(address);
    } catch (error) {
      showErrorSnackbar({ message: 'Не удалось получить геоданные' });
    } finally {
      setSelectedLocation(coords.reverse());
    }
  };

  const handleSelectClick = () => {
    if (snap.parkDate === null) {
      showErrorSnackbar({ message: 'Не удалось загрузить данные', tryAgain: true });
      navigate('/search-time');
    } else if (selectedAddress) {
      state.parkDate.address = selectedAddress;
      navigate(-1);
    }
  };

  useEffect(() => {
    if (snap.parkDate) {
      if (snap.parkDate.coordinates) setSelectedLocation(snap.parkDate.coordinates);
      if (snap.parkDate.address) setSelectedAddress(snap.parkDate.address);
    }
  }, []);

  useEffect(() => {
    if (snap.parkDate) {
      if (snap.parkDate.coordinates) return setDefaultCoords(snap.parkDate.coordinates);

      switch (snap.parkDate.region) {
        case 'spb':
          return setDefaultCoords([59.938784, 30.314997]);
        case 'moscow':
          return setDefaultCoords([55.755864, 37.617698]);
        default:
          return setDefaultCoords([55.755864, 37.617698]);
      }
    }
  }, []);

  useEffect(() => {
    if (watchMe) {
      const watchID = navigator.geolocation.watchPosition(async function (position) {
        setSelectedLocation([position.coords.latitude, position.coords.longitude]);
        setDefaultCoords([position.coords.latitude, position.coords.longitude]);
        setSelectAnotherButton(true);
        let coords = [position.coords.longitude, position.coords.latitude];

        try {
          const response = await axios.get(
            `https://geocode-maps.yandex.ru/1.x/?apikey=${API_KEY}&geocode=${coords.join(',')}&format=json`
          );

          const address =
            response.data.response.GeoObjectCollection.featureMember[0].GeoObject
              .metaDataProperty.GeocoderMetaData.text;

          setSelectedAddress(address);
        } catch (error) {
          showErrorSnackbar({ message: 'Не удалось получить ваши геоданные' });
        }
      });

      return () => {
        navigator.geolocation.clearWatch(watchID);
      };
    }
  }, [watchMe]);

  return (
    <>
      <NavBar />
      <div className={styles.address_wrapper}>
        <div className={styles.address}>
          <span className={`${selectedAddress.length > 35 ? styles.animated : styles.ellipsis}`}>
            {selectedAddress || 'Выберите местоположение на карте'}
          </span>
        </div>
      </div>
      <div className={styles.end_wrapper}>
        <div className={styles.end_top_wrapper}>
          <button className={styles.select_btn} onClick={handleSelectClick}>
            Выбрать
          </button>
          {!selectedLocation && (
            <button
              type="button"
              onClick={() => setWatchMe(true)}
              className={`${styles.my_coords_button}`}
            >
              <img
                className={styles.img}
                src={snap.user?.theme === 'light' ? navigation : navigationDark}
                alt="Navigation Icon"
              />
            </button>
          )}
        </div>
        {selectAnotherButton && (
          <button className={styles.select_btn} onClick={handleAnotherAddressClick}>
            Выбрать другой адрес
          </button>
        )}
      </div>
      <YMaps apiKey={API_KEY}>
        <Map
          width="100%"
          height="95vh"
          state={{
            center: defaultCoords,
            zoom: 16,
            type: 'yandex#map',
          }}
          options={{
            suppressMapOpenBlock: true,
            suppressYandexSearch: true,
            restrictMapArea:
              snap.parkDate.region === 'spb'
                ? saintPetersburgBounds
                : snap.parkDate.region === 'moscow'
                ? moscowBounds
                : undefined,
          }}
          onClick={handleMapClick}
        >
          {selectedLocation && <Placemark geometry={selectedLocation} />}
        </Map>
      </YMaps>
    </>
  );
};

export default ChooseMap;
