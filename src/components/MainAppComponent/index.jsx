import { SnackbarProvider } from 'notistack'
import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import axios from 'src/api/interceptors'
import ChooseMap from 'src/components/ChooseMap'
import ScrollToTop from 'src/components/ScrollToTop'
import AboutServicePage from 'src/pages/AboutServicePage'
import AdminInfoPage from 'src/pages/AdminInfoPage'
import AdminPage from 'src/pages/AdminPage'
import AgreementPage from 'src/pages/AgreementPage'
import ChooseAnotherTimePage from 'src/pages/ChooseAnotherTimePage'
import ChooseTimeTodayPage from 'src/pages/ChooseTimeTodayPage'
import ChooseTimeTomorrowPage from 'src/pages/ChooseTimeTomorrowPage'
import ExtraOptionsPage from 'src/pages/ExtraOptionsPage'
import FAQPage from 'src/pages/FAQPage'
import HomePage from 'src/pages/HomePage'
import OptionsPage from 'src/pages/OptionsPage'
import PersonalAreaPage from 'src/pages/PersonalAreaPage'
import ResultSearchElementPage from 'src/pages/ResultSearchElementPage'
import ResultSearchPage from 'src/pages/ResultSearchPage'
import ReviewPage from 'src/pages/ReviewPage'
import SearchAnotherTimePage from 'src/pages/SearchAnotherTimePage'
import SearchTimePage from 'src/pages/SearchTimePage'
import SearchTodayPage from 'src/pages/SearchTodayPage'
import SearchTomorrowPage from 'src/pages/SearchTomorrowPage'
import SelectAddressLocationPage from 'src/pages/SelectAddressLocationPage'
import SelectInMapPage from 'src/pages/SelectInMapPage'
import ShowMapResultPage from 'src/pages/ShowMapResultPage'
import { state } from 'src/state'

import { showErrorSnackbar } from 'src/utils/showSnackBar'
import { useSnapshot } from 'valtio'

const MainAppComponent = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/admin") return;

    window.Telegram.WebApp.ready();
    const tg = window?.Telegram?.WebApp;
    tg.expand();
    const user = tg.initDataUnsafe.user;
    
    if (user) {
      const chatId = user.id;
      axios.get(
        `https://api.parkangel.ru/api/users/chatId/${chatId}`
      ).then((response) => {
        if (response.data.response) state.user = response.data.response;
        else {
          axios.post(
            "https://api.parkangel.ru/api/users",
            {
              chatId: chatId + "",
              telegram: user.username,
              name: user.first_name,
              phoneNumber: "",
              password: "",
              email: "",
              city: "moscow",
              theme: "light",
            },
          ).then((response) => state.user = response.data.response)
          .catch(() => showErrorSnackbar({ message: "Не удалось записать юзера" }))
        }
      }).catch(() => showErrorSnackbar({ message: "Что-то пошло не так" }))
    } else navigate("/");
  }, []);

  useEffect(() => {
    if (snap.user) {
      axios.get(`https://api.parkangel.ru/api/options/userId/${snap.user.id}`)
        .then((response) => state.options = response.data.response)
        .catch(() => showErrorSnackbar({ message: "Не удалось загрузить опции" }))
    }
  }, [snap.user?.id]);

  return (
    <div data-theme={snap.user?.theme || "light"} style={{ width: "100vw" }}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        maxSnack={2}
        autoHideDuration={3000}
      >
          <ScrollToTop/>
            <Routes>
              <Route path="/search-time" element={<SearchTimePage/>}/>
              <Route path="/" exact element={<HomePage/>} />
              <Route path="/agreement" element={<AgreementPage/>}/>
              <Route
                path="/select-address-location"
                element={<SelectAddressLocationPage/>}
              />
              <Route path="/about-service" element={<AboutServicePage/>}/>
              <Route path="/faq" element={<FAQPage/>}/>
              <Route path="/choose-time-today" element={<ChooseTimeTodayPage/>}/>
              <Route
                path="/choose-time-tomorrow"
                element={<ChooseTimeTomorrowPage/>}
              />
              <Route
                path="/choose-another-time"
                element={<ChooseAnotherTimePage/>}
              />
              <Route path="/personal-area" element={<PersonalAreaPage/>}/>
              <Route path="/result-search/:id" element={<ResultSearchElementPage/>}/>
              <Route path="/result-search" element={<ResultSearchPage/>}/>
              <Route path="/extra-options" element={<ExtraOptionsPage/>}/>
              <Route path="/options" element={<OptionsPage/>}/>
              <Route path="/show-map-result" element={<ShowMapResultPage/>}/>
              <Route path="/search-today" element={<SearchTodayPage/>}/>
              <Route
                path="/search-another-time"
                element={<SearchAnotherTimePage/>}
              />
              <Route path="/search-tomorrow" element={<SearchTomorrowPage/>}/>
              <Route path="/SelectInMap" element={<SelectInMapPage/>}/>
              <Route path="/review" element={<ReviewPage/>}/>
              <Route path="/map" element={<ChooseMap/>}/>
              <Route path="/admin" element={<AdminPage/>}/>
              <Route path="/admin/info" element={<AdminInfoPage/>}/>
            </Routes>
      </SnackbarProvider>
    </div>
  );
};

export default MainAppComponent;