import { BrowserRouter as Router } from "react-router-dom";

import MainAppComponent from "src/components/MainAppComponent";

const App = () => {
  return (
    <Router>
      <MainAppComponent/>
    </Router>
  );
};

export default App;
