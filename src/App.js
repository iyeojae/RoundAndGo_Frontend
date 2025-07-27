import logo from './logo.png';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstMainPage from "./FirstMain/FirstMainPage";
import MainPage from "./Main/MainPage";


function App() {
  return (
      <Router>
          <div style={{minWidth: '375px', maxWidth: '440px', margin: '0 auto'}}>
              <Routes>
                  <Route path="/" element={<FirstMainPage />} />
                  <Route path="/main" element={<MainPage />} />f
              </Routes>
          </div>
      </Router>
  );
}

export default App;
