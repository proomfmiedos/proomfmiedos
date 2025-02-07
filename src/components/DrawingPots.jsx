import './DrawingPots.css'
import teamsData from '../data/teams.json'
import potsData from '../data/pots.json'

const DrawingPots = () => {
  const renderTeam = (teamId) => {
    const team = teamsData.teams[teamId];
    return (
      <div key={teamId} className="pot-team">
        <img src={team.image} alt={team.name} className="pot-team-image" />
        <span className="pot-team-name">{team.name}</span>
      </div>
    );
  };

  return (
    <div className="content-block min border">
      <div className="content-block__header">
        <p>Bombos del Sorteo</p>
      </div>
      <div className="content-block__body">
        <div className="pots-container">
          {Object.entries(potsData.pots).map(([potNumber, teamIds]) => (
            <div key={potNumber} className="pot">
              <h3 className="pot-title">Bombo {potNumber}</h3>
              <div className="pot-teams">
                {teamIds.map(teamId => renderTeam(teamId))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrawingPots; 