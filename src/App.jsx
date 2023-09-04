import HomePage from "./pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AgreementPage from "./pages/AgreementPage";
import SelectAdressLocationPage from "./pages/SelectAdressLocationPage";
import AboutServicePage from "./pages/AboutServicePage";
import FAQPage from "./pages/FAQPage";
import SearchTimePage from "./pages/SearchTimePage";
import ChooseTimeTodayPage from "./pages/ChooseTimeTodayPage";
import ChooseTimeTomorrowPage from "./pages/ChooseTimeTomorrowPage";
import PersonalAreaPage from "./pages/PersonalAreaPage";
import ResultSearchPage from "./pages/ResultSearchPage";
import ExtraOptionsPage from "./pages/ExtraOptionsPage";
import RatingModalPage from "./pages/RatingModal";
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
import { DataContextProvider } from "./DataContext";
import ChooseMap from "./components/ChooseMap/ChooseMap";
import { SnackbarProvider } from "notistack";

const App = () => {
  return (
    <SnackbarProvider
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      maxSnack={2}
      autoHideDuration={2000}
    >
      <DataContextProvider>
        <Router>
          <ScrollToTop />
            <Routes>
              <Route path="/search-time" element={<SearchTimePage/>}/>
              <Route path="/" exact element={<HomePage/>} />
              <Route path="/agreement" element={<AgreementPage/>}/>
              <Route
                path="/SelectAdressLocation"
                element={<SelectAdressLocationPage/>}
              />
              <Route path="/AboutService" element={<AboutServicePage/>}/>
              <Route path="/FAQ" element={<FAQPage/>}/>
              <Route path="/ChooseTimeToday" element={<ChooseTimeTodayPage/>}/>
              <Route
                path="/ChooseTimeTomorrow"
                element={<ChooseTimeTomorrowPage/>}
              />
              <Route path="/PersonalArea" element={<PersonalAreaPage/>}/>
              <Route path="/ResultSearch" element={<ResultSearchPage/>}/>
              <Route path="/ExtraOptions" element={<ExtraOptionsPage/>}/>
              <Route path="/rating" element={<RatingModalPage/>}/>
              <Route
                path="/ChooseAnotherTime"
                element={<ChooseAnotherTimePage/>}
              />
              <Route path="/ShowMapResult" element={<ShowMapResultPage/>}/>
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
      </DataContextProvider>
    </SnackbarProvider>
  );
};

export default App;
