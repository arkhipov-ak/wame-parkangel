import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AgreementPage from "./pages/AgreementPage";
import SelectAddressLocationPage from "./pages/SelectAddressLocationPage";
import AboutServicePage from "./pages/AboutServicePage";
import FAQPage from "./pages/FAQPage";
import SearchTimePage from "./pages/SearchTimePage";
import ChooseTimeTodayPage from "./pages/ChooseTimeTodayPage";
import ChooseTimeTomorrowPage from "./pages/ChooseTimeTomorrowPage";
import ChooseAnotherTimePage from "./pages/ChooseAnotherTimePage";
import PersonalAreaPage from "./pages/PersonalAreaPage";
import ResultSearchPage from "./pages/ResultSearchPage";
import ResultSearchElementPage from "./pages/ResultSearchElementPage";
import ExtraOptionsPage from "./pages/ExtraOptionsPage";
import OptionsPage from "./pages/OptionsPage";
import ShowMapResultPage from "./pages/ShowMapResultPage";
import SearchTodayPage from "./pages/SearchTodayPage";
import SearchAnotherTimePage from "./pages/SearchAnotherTimePage";
import SearchTomorrowPage from "./pages/SearchTomorrowPage";
import SelectInMapPage from "./pages/SelectInMapPage";
import ReviewPage from "./pages/ReviewPage";
import ScrollToTop from "./components/ScrollToTop";
import ChooseMap from "./components/ChooseMap";
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import { showErrorSnackbar } from "./utils/showSnackBar";
import axios from "axios";
import { state } from "./state";
import { useSnapshot } from "valtio";

const App = () => {
  const snap = useSnapshot(state);

  useEffect(() => {
    window.Telegram.WebApp.ready();
    const tg = window?.Telegram?.WebApp;
    tg.expand()
    const getUser = async () => {
      const user = tg.initDataUnsafe.user;
      if (user) {
        const chatId = user.id;
        console.log(chatId);
        await axios.get(`https://parkangel-backend.protomusic.ru/api/users/chatId/${chatId}`)
          .then((response) => {
            if (response.data.response) state.user = response.data.response;
            else {
              axios.post(
                "https://parkangel-backend.protomusic.ru/api/users",
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
          })
          .catch(() => showErrorSnackbar({ message: "Что-то пошло не так" }))
      }
    }
   
    getUser();
  }, []);

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(`https://parkangel-backend.protomusic.ru/api/options/userId/${snap.user.id}`)
        .then((response) => state.options = response.data.response)
        .catch(() => showErrorSnackbar({ message: "Не удалось загрузить опции" }))
    }
  }, [snap.user]);

  return (
    <div data-theme={snap.theme}>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        maxSnack={2}
        autoHideDuration={3000}
      >
        <Router>
          <ScrollToTop />
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
        </Router>
      </SnackbarProvider>
    </div>
  );
};

export default App;
