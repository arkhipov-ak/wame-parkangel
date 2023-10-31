import { BrowserRouter as Router } from "react-router-dom";

import MainAppComponent from "./components/MainAppComponent";

const App = () => {
  return (
    <Router>
      <MainAppComponent/>
    </Router>
  );
};

export default App;
