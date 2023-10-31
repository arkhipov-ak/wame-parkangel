import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useSnapshot } from "valtio";
import { SnackbarProvider } from "notistack";

import { showErrorSnackbar } from "../../utils/showSnackBar";
import { state } from "../../state";
import HomePage from "../../pages/HomePage";
import AgreementPage from "../../pages/AgreementPage";
import SelectAddressLocationPage from "../../pages/SelectAddressLocationPage";
import AboutServicePage from "../../pages/AboutServicePage";
import FAQPage from "../../pages/FAQPage";
import SearchTimePage from "../../pages/SearchTimePage";
import ChooseTimeTodayPage from "../../pages/ChooseTimeTodayPage";
import ChooseTimeTomorrowPage from "../../pages/ChooseTimeTomorrowPage";
import ChooseAnotherTimePage from "../../pages/ChooseAnotherTimePage";
import PersonalAreaPage from "../../pages/PersonalAreaPage";
import ResultSearchPage from "../../pages/ResultSearchPage";
import ResultSearchElementPage from "../../pages/ResultSearchElementPage";
import ExtraOptionsPage from "../../pages/ExtraOptionsPage";
import OptionsPage from "../../pages/OptionsPage";
import ShowMapResultPage from "../../pages/ShowMapResultPage";
import SearchTodayPage from "../../pages/SearchTodayPage";
import SearchAnotherTimePage from "../../pages/SearchAnotherTimePage";
import SearchTomorrowPage from "../../pages/SearchTomorrowPage";
import SelectInMapPage from "../../pages/SelectInMapPage";
import ReviewPage from "../../pages/ReviewPage";
import ScrollToTop from "../../components/ScrollToTop";
import ChooseMap from "../../components/ChooseMap";

const MainAppComponent = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  useEffect(() => {
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
    if (snap && snap.user) {
      axios.get(`https://api.parkangel.ru/api/options/userId/${snap.user.id}`)
        .then((response) => state.options = response.data.response)
        .catch(() => showErrorSnackbar({ message: "Не удалось загрузить опции" }))
    }
  }, [snap.user]);

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
            </Routes>
      </SnackbarProvider>
    </div>
  );
};

export default MainAppComponent;