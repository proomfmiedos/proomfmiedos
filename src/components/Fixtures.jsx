import './Fixtures.css'
import fixturesData from '../data/fixtures.json'
import teamsData from '../data/teams.json'
import groupsData from '../data/groups.json'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Fixtures = () => {
  // Calculate odds based on team stats
  const calculateOdds = (team) => {
    // Base calculation from followers (normalized between 0.5 and 2)
    const maxFollowers = Math.max(...Object.values(teamsData.teams).map(t => t.followers || 0));
    const followerFactor = 1.5 * (1 - (team.followers / maxFollowers)) + 0.5;
    
    // Win/Loss ratio factor (between 0.7 and 1.3)
    const totalGames = team.wins + team.losses;
    const winRatio = totalGames > 0 ? team.wins / totalGames : 0.5;
    const winFactor = 0.7 + (1 - winRatio) * 0.6;
    
    // Create a seeded random factor using follower count and W/L ratio
    const seed = (team.followers * 100 + (winRatio * 1000)) || 1;
    const seededRandom = Math.abs(Math.sin(seed)) * 0.4 + 0.8; // Random factor between 0.8 and 1.2
    
    // Combine all factors and ensure odds are between 0.1 and 4
    let odds = followerFactor * winFactor * seededRandom;
    odds = Math.max(0.1, Math.min(4, odds));
    
    // Round to 2 decimal places
    return Number(odds.toFixed(2));
  };

  // Get all unique dates from fixtures
  const allDates = [...new Set(fixturesData.matches.map(match => match.date))].sort();
  
  // Get today's date in DD/MM format
  const today = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit'
  });

  // Find closest date to today in our fixtures
  const defaultDateIndex = allDates.findIndex(date => date >= today) || 0;
  const [currentDateIndex, setCurrentDateIndex] = useState(defaultDateIndex);

  const currentDate = allDates[currentDateIndex];
  const hasNext = currentDateIndex < allDates.length - 1;
  const hasPrev = currentDateIndex > 0;

  const handlePrev = () => {
    if (hasPrev) {
      setCurrentDateIndex(currentDateIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentDateIndex(currentDateIndex + 1);
    }
  };

  // Get group letter for a team
  const getTeamGroup = (teamId) => {
    for (const [group, teams] of Object.entries(groupsData.groups)) {
      if (teams.includes(teamId)) {
        return group;
      }
    }
    return '';
  };

  // Get matches for current date
  const currentMatches = fixturesData.matches.filter(match => match.date === currentDate);

  return (
    <div className="content-block min border">
      <div className="content-block__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p>Partidos</p>
          <Link to="/fixtures" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '14px' }}>
            Ver Todo
          </Link>
        </div>
      </div>
      <div className="content-block__body">
        <div className="fixtures-navigation">
          <button 
            className="nav-button" 
            onClick={handlePrev}
            disabled={!hasPrev}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="current-date">Fecha {currentDate}</div>
          <button 
            className="nav-button" 
            onClick={handleNext}
            disabled={!hasNext}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
        <div className="fixture-matches">
          {currentMatches.map((match) => {
            const homeTeam = teamsData.teams[match.homeTeamId];
            const awayTeam = teamsData.teams[match.awayTeamId];
            const groupLetter = getTeamGroup(match.homeTeamId);
            
            // Calculate odds for both teams
            const homeOdds = calculateOdds(homeTeam);
            const awayOdds = calculateOdds(awayTeam);

            const isHomeWinner = match.homeScore > match.awayScore;
            const isAwayWinner = match.awayScore > match.homeScore;
            
            return (
              <div key={match.id} className="fixture-match">
                <div className="fixture-group">Grupo {groupLetter}</div>
                <div className="fixture-teams">
                  <div className={`fixture-team ${isHomeWinner ? 'winner' : ''}`}>
                    <img src={homeTeam.image} alt={homeTeam.name} />
                    <span>{homeTeam.name}</span>
                  </div>
                  <div className="fixture-vs">
                    {match.status === "Completed" ? `${match.homeScore} - ${match.awayScore}` : "vs"}
                  </div>
                  <div className={`fixture-team ${isAwayWinner ? 'winner' : ''}`}>
                    <img src={awayTeam.image} alt={awayTeam.name} />
                    <span>{awayTeam.name}</span>
                  </div>
                </div>
                {match.status !== "Completed" && (
                  <div className="fixture-betting">
                    <div className="betting-buttons">
                      <button 
                        className="bet-button"
                        onClick={() => window.open('https://www.youtube.com/watch?v=GfRqQNKsRQA', '_blank')}
                      >
                        {homeTeam.name}
                        <span className="odds">{homeOdds}</span>
                      </button>
                      <button 
                        className="bet-button"
                        onClick={() => window.open('https://www.youtube.com/watch?v=GfRqQNKsRQA', '_blank')}
                      >
                        {awayTeam.name}
                        <span className="odds">{awayOdds}</span>
                      </button>
                    </div>
                    <div className="betting-caption">
                      APUESTA EN OOMFXBET
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Fixtures; 