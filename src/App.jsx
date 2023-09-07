import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AgreementPage from "./pages/AgreementPage";
import SelectAddressLocationPage from "./pages/SelectAddressLocationPage";
import AboutServicePage from "./pages/AboutServicePage";
import FAQPage from "./pages/FAQPage";
import SearchTimePage from "./pages/SearchTimePage";
import ChooseTimeTodayPage from "./pages/ChooseTimeTodayPage";
import ChooseTimeTomorrowPage from "./pages/ChooseTimeTomorrowPage";
import PersonalAreaPage from "./pages/PersonalAreaPage";
import ResultSearchPage from "./pages/ResultSearchPage";
import ExtraOptionsPage from "./pages/ExtraOptionsPage";
import OptionsPage from "./pages/OptionsPage";
import ChooseAnotherTimePage from "./pages/ChooseAnotherTimePage";
import ShowMapResultPage from "./pages/ShowMapResultPage";
import SearchTodayPage from "./pages/SearchTodayPage";
import SearchAnotherTimePage from "./pages/SearchAnotherTimePage";
import SearchTomorrowPage from "./pages/SearchTomorrowPage";
import SelectInMapPage from "./pages/SelectInMapPage";
import ReviewPage from "./pages/ReviewPage";
import YourAddPage from "./pages/YourAddPage";
import ExtraPage from "./pages/ExtraPage";
import AddPage from "./pages/AddPage";
import ScrollToTop from "./components/ScrollToTop";
import ChooseMap from "./components/ChooseMap/ChooseMap";
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
      /* const user = tg.initDataUnsafe.user; */
      /* console.log(user); */
      /* if (user) { */
        /* const userId = user.id; */
        /* console.log('userId', userId); */
        await axios.get(`http://185.238.2.176:5064/api/users/chatId/${5465844067777}`)
          .then(response => {
            if (response.data.response) state.user = response.data.response
            else {
              axios.post(
                "http://185.238.2.176:5064/api/users",
                {
                  chatId: "5465844067777",
                  name: "Stas",
                  telegram: "telega",
                  phoneNumber: "",
                  username: "",
                  email: "",
                  password: "",
                  city: ""
                },
              ).then(response => state.user = response.data.response)
              .catch(() => showErrorSnackbar({ message: "Не удалось записать юзера" }))
            }
          })
          .catch(() => {showErrorSnackbar({ message: "Что-то пошло не так" })})
      /* } */
    }
   
    getUser();
  }, []);

  useEffect(() => {
    if (snap && snap.user) {
      axios.get(`http://185.238.2.176:5064/api/options/userId/${snap.user.id}`)
        .then(response => state.options = response.data.response)
        .catch(() => showErrorSnackbar({ message: "Не удалось загрузить опции" }))
    }
  }, [snap.user]);

  return (
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
            <Route path="/AboutService" element={<AboutServicePage/>}/>
            <Route path="/FAQ" element={<FAQPage/>}/>
            <Route path="/ChooseTimeToday" element={<ChooseTimeTodayPage/>}/>
            <Route
              path="/ChooseTimeTomorrow"
              element={<ChooseTimeTomorrowPage/>}
            />
            <Route path="/PersonalArea" element={<PersonalAreaPage/>}/>
            <Route path="/result-search" element={<ResultSearchPage/>}/>
            <Route path="/extra-options" element={<ExtraOptionsPage/>}/>
            <Route path="/options" element={<OptionsPage/>}/>
            <Route
              path="/ChooseAnotherTime"
              element={<ChooseAnotherTimePage/>}
            />
            <Route path="/show-map-result" element={<ShowMapResultPage/>}/>
            <Route path="/search-today" element={<SearchTodayPage/>}/>
            <Route
              path="/search-another-time"
              element={<SearchAnotherTimePage/>}
            />
            <Route path="/search-tomorrow" element={<SearchTomorrowPage/>}/>
            <Route path="/SelectInMap" element={<SelectInMapPage/>}/>
            <Route path="/Review" element={<ReviewPage/>}/>
            <Route path="/YourAdd" element={<YourAddPage/>}/>
            <Route path="/Extra" element={<ExtraPage/>}/>
            <Route path="/Add" element={<AddPage/>}/>
            <Route path="/ChooseMap" element={<ChooseMap/>}/>
          </Routes>
      </Router>
    </SnackbarProvider>
  );
};

export default App;
