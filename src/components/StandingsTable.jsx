import './StandingsTable.css'
import teamsData from '../data/teams.json'
import groupsData from '../data/groups.json'
import potsData from '../data/pots.json'
import fixturesData from '../data/fixtures.json'
import { useState } from 'react'

const StandingsTable = () => {
  const [showPots, setShowPots] = useState(false);

  const getFormClass = (result) => {
    switch(result) {
      case 'W': return 'command-history-result_win__gnUlu'
      case 'D': return 'command-history-result_draw__0Nk31'
      case 'L': return 'command-history-result_loss__XdPer'
      default: return ''
    }
  }

  const getFormLabel = (result) => {
    switch(result) {
      case 'W': return 'V'
      case 'D': return 'E'
      case 'L': return 'D'
      default: return ''
    }
  }

  const getPositionColor = (position) => {
    switch(position) {
      case 1:
      case 2:
        return 'rgb(118, 179, 0)' // Green for playoffs
      case 3:
        return 'rgb(3, 169, 244)' // Blue for Oomfropa
      case 4:
        return 'rgb(255, 82, 0)' // Red for eliminated
      default:
        return 'inherit'
    }
  }

  // Function to sort teams within a group
  const sortTeams = (teams) => {
    return teams.sort((a, b) => {
      // First sort by points
      if (b.points !== a.points) return b.points - a.points;
      
      // If points are tied, sort by percentage
      if (b.percentage !== a.percentage) return b.percentage - a.percentage;
      
      // If percentage is tied, sort alphabetically
      return a.name.localeCompare(b.name);
    });
  };

  // Function to calculate the average score for a team
  const calculateAverageScore = (teamId) => {
    const matches = fixturesData.matches.filter(match => 
      match.homeTeamId === teamId || match.awayTeamId === teamId
    );

    const totalScore = matches.reduce((acc, match) => {
      if (match.status === 'Completed') {
        if (match.homeTeamId === teamId) {
          return acc + match.homeScore;
        } else if (match.awayTeamId === teamId) {
          return acc + match.awayScore;
        }
      }
      return acc;
    }, 0);

    const completedMatchesCount = matches.filter(match => match.status === 'Completed').length;
    return completedMatchesCount > 0 ? Math.floor(totalScore / completedMatchesCount) : 0;
  };

  // Function to calculate points for a team
  const calculatePoints = (teamId) => {
    const matches = fixturesData.matches.filter(match => 
      match.status === 'Completed' && 
      (match.homeTeamId === teamId || match.awayTeamId === teamId)
    );

    return matches.reduce((points, match) => {
      if (match.homeTeamId === teamId && match.homeScore > match.awayScore) {
        return points + 3; // Home win
      } else if (match.awayTeamId === teamId && match.awayScore > match.homeScore) {
        return points + 3; // Away win
      }
      return points; // No points for a draw or loss
    }, 0);
  };

  // Process groups and sort teams within each group
  const processedGroups = Object.entries(groupsData.groups).map(([groupLetter, teamIds]) => {
    const groupTeams = teamIds.map(id => ({
      ...teamsData.teams[id],
      groupLetter,
      points: calculatePoints(id), // Calculate points dynamically
      averageScore: calculateAverageScore(id)
    }));
    return sortTeams(groupTeams);
  });

  const renderPot = (potNumber, teamIds) => {
    return (
      <div key={potNumber} className="pot">
        <h3 className="pot-title">Bombo {potNumber}</h3>
        <div className="pot-teams">
          {teamIds.map(teamId => {
            const team = teamsData.teams[teamId];
            return (
              <div key={teamId} className="pot-team">
                <img src={team.image} alt={team.name} className="pot-team-image" />
                <span className="pot-team-name">{team.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="content-block min border">
      <div className="content-block__header">
        <div className="header-content">
          <p>Fase de Grupos</p>
          <button 
            className="toggle-pots-button"
            onClick={() => setShowPots(!showPots)}
          >
            {showPots ? 'Ver Grupos' : 'Ver Bombos'}
          </button>
        </div>
      </div>
      <div className="content-block__body">
        {showPots ? (
          <div className="pots-container">
            {Object.entries(potsData.pots).map(([potNumber, teamIds]) => 
              renderPot(potNumber, teamIds)
            )}
          </div>
        ) : (
          <>
            <div className="table_table_wrapper__AMfAt">
              <table className="table-block table_table__LTgjZ">
                <thead className="thead_thead__kYGiX">
                  <tr className="table-row row_row__vWDV9">
                    <td className="td_table_td_col__UdgoO td_bold__rJ5vf td_start___dglW">Grupo</td>
                    <td className="td_table_td_col__UdgoO td_border__bFkDF td_minTeam__wh3JF">Equipos</td>
                    <td className="td_table_td_col__UdgoO td_bold__rJ5vf td_border__bFkDF td_w24__tbjk6">PTS</td>
                    <td className="td_table_td_col__UdgoO td_fitContent__R4qJY">J</td>
                    <td className="td_table_td_col__UdgoO td_fitContent__R4qJY">%</td>
                    <td className="td_table_td_col__UdgoO td_fitContent__R4qJY">Últimas</td>
                  </tr>
                </thead>
                <tbody className="tbody_tablebody__cDt0I">
                  {processedGroups.map((groupTeams, groupIndex) => (
                    <>
                      {groupIndex > 0 && (
                        <tr className="group-separator">
                          <td colSpan="6"></td>
                        </tr>
                      )}
                      {groupTeams.map((team, teamIndex) => (
                        <tr key={team.id} className={`table-row row_row__vWDV9 ${
                          teamIndex < 2 ? 'qualified' : 
                          teamIndex === 2 ? 'oomfropa' : 
                          'eliminated'
                        }`}>
                          <td style={{color: getPositionColor(teamIndex + 1)}} className="td_table_td_col__UdgoO td_bold__rJ5vf td_start___dglW">
                            <span>{team.groupLetter}{teamIndex + 1}</span>
                          </td>
                          <td className="td_table_td_col__UdgoO td_border__bFkDF td_minTeam__wh3JF">
                            <div className="table_team_block__y6rYP team-block">
                              <div className="table_table_sticky_image__ip3MJ table-sticky-image">
                                <img className="table_table_team_image___vCP0" height="16" width="16" src={team.image} alt={team.name} />
                              </div>
                              <p>{team.name}</p>
                            </div>
                          </td>
                          <td className="td_table_td_col__UdgoO td_bold__rJ5vf td_border__bFkDF td_w24__tbjk6">{team.points}</td>
                          <td className="td_table_td_col__UdgoO td_fitContent__R4qJY">{team.played}</td>
                          <td className="td_table_td_col__UdgoO td_fitContent__R4qJY">{team.averageScore}%</td>
                          <td className="td_table_td_col__UdgoO td_fitContent__R4qJY">
                            <ul className="command-history-result_list__E_jQM command-history-result_min__b0St0">
                              {team.form.map((result, index) => (
                                <li key={index} className={`command-history-result_block__1lUy5 command-history-result_min__b0St0 ${getFormClass(result)}`}>
                                  <div>{getFormLabel(result)}</div>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="table-info_list__oJWri">
              <li className="table-info_text_block__Wp1h7">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                  <circle cx="6.5" cy="6" r="6" fill="#76B300"></circle>
                </svg>
                <p className="table-info_text__JrQIs">Clasificado a Playoffs</p>
              </li>
              <li className="table-info_text_block__Wp1h7">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                  <circle cx="6.5" cy="6" r="6" fill="#03A9F4"></circle>
                </svg>
                <p className="table-info_text__JrQIs">Clasificado a Oomfropa League</p>
              </li>
              <li className="table-info_text_block__Wp1h7">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                  <circle cx="6.5" cy="6" r="6" fill="#FF5200"></circle>
                </svg>
                <p className="table-info_text__JrQIs">Eliminado</p>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default StandingsTable 