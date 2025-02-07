import './FixturesPage.css'
import fixturesData from '../data/fixtures.json'
import teamsData from '../data/teams.json'
import groupsData from '../data/groups.json'
import { Link } from 'react-router-dom'

const FixturesPage = () => {
  // Get group letter for a team
  const getTeamGroup = (teamId) => {
    for (const [group, teams] of Object.entries(groupsData.groups)) {
      if (teams.includes(teamId)) {
        return `Grupo ${group}`;
      }
    }
    return '';
  };

  // Get match type based on match id or description
  const getMatchType = (match) => {
    if (match.id === 'final') return 'Final';
    if (match.id.startsWith('sf')) return 'Semifinal';
    return getTeamGroup(match.homeTeamId);
  };

  // Group fixtures by date and sort dates
  const fixturesByDate = fixturesData.matches.reduce((acc, match) => {
    if (!acc[match.date]) {
      acc[match.date] = [];
    }
    acc[match.date].push(match);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(fixturesByDate).sort((a, b) => {
    const [dayA, monthA] = a.split('/').map(Number);
    const [dayB, monthB] = b.split('/').map(Number);
    if (monthA !== monthB) return monthA - monthB;
    return dayA - dayB;
  });

  return (
    <div className="fixtures-page">
      <div className="fixtures-container">
        <div className="content-block min border" style={{ marginBottom: '24px' }}>
          <div className="content-block__header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p>Calendario de Partidos</p>
              <Link to="/" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontSize: '14px' }}>
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
        <div className="fixture-dates">
          {sortedDates.map(date => (
            <div key={date} className="fixture-date-group">
              <h3 className="fixture-date">Fecha {date}</h3>
              <div className="fixture-matches">
                {fixturesByDate[date].map((match) => {
                  const homeTeam = teamsData.teams[match.homeTeamId];
                  const awayTeam = teamsData.teams[match.awayTeamId];
                  const matchType = getMatchType(match);

                  const isHomeWinner = match.homeScore > match.awayScore;
                  const isAwayWinner = match.awayScore > match.homeScore;
                  
                  return (
                    <div key={match.id} className="fixture-match">
                      <div className="fixture-group">{matchType}</div>
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
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FixturesPage; 