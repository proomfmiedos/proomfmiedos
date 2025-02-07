import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import StandingsTable from './components/StandingsTable'
import Fixtures from './components/Fixtures'
import PlayoffBracket from './components/PlayoffBracket'
import FixturesPage from './pages/FixturesPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/fixtures" element={<FixturesPage />} />
        <Route path="/" element={
          <div className="app-container">
            <div className="content-wrapper">
              <div className="main-content">
                <div className="left-side">
                  <StandingsTable />
                </div>
                <div className="right-side">
                  <PlayoffBracket />
                </div>
              </div>
              <div className="sidebar">
                <Fixtures />
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
