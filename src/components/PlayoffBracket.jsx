import './PlayoffBracket.css'
import teamsData from '../data/teams.json'
import groupsData from '../data/groups.json'

const PlayoffBracket = () => {
  // Function to sort teams within a group
  const sortTeams = (teams) => {
    return teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
      const aGoalsScored = parseInt(a.goals.split(':')[0]);
      const bGoalsScored = parseInt(b.goals.split(':')[0]);
      if (bGoalsScored !== aGoalsScored) return bGoalsScored - aGoalsScored;
      return a.name.localeCompare(b.name);
    });
  };

  // Get qualified teams from each group
  const getQualifiedTeams = () => {
    const qualified = {};
    Object.entries(groupsData.groups).forEach(([groupLetter, teamIds]) => {
      const groupTeams = teamIds.map(id => ({
        ...teamsData.teams[id],
        groupLetter
      }));
      const sortedTeams = sortTeams(groupTeams);
      qualified[groupLetter] = {
        first: sortedTeams[0],
        second: sortedTeams[1],
        third: sortedTeams[2]  // Add third place
      };
    });
    return qualified;
  };

  const qualifiedTeams = getQualifiedTeams();

  const quarterFinals = [
    { home: teamsData.teams["DON"], away: teamsData.teams["AKU"] },
    { home: teamsData.teams["MAN"], away: teamsData.teams["VIO"] },
    { home: teamsData.teams["YSB"], away: teamsData.teams["NEV"] },
    { home: teamsData.teams["ENU"], away: teamsData.teams["MON"] }
  ];

  const loserBracket = [
    { home: teamsData.teams["TBD"], away: teamsData.teams["TBD"] },
    { home: teamsData.teams["TBD"], away: teamsData.teams["TBD"] }
  ];

  const renderTeam = (team) => {
    if (!team) return <div className="bracket-team bracket-team--empty">TBD</div>;
    
    return (
      <div className="bracket-team">
        <img src={team.image} alt={team.name} className="bracket-team-image" />
        <span className="bracket-team-name">{team.name}</span>
      </div>
    );
  };

  const renderEmptyTeam = () => {
    const team = teamsData.teams["TBD"];
    return (
      <div className="bracket-team">
        <img src={team.image} alt={team.name} className="bracket-team-image" />
        <span className="bracket-team-name">{team.name}</span>
      </div>
    );
  };

  return (
    <div className="content-block min border">
      <div className="content-block__header">
        <p>Playoffs</p>
      </div>
      <div className="content-block__body">
        <div className="brackets-container">
          <div className="playoff-bracket">
            <div className="playoff-round">
              <h3 className="playoff-round-title">Cuartos de Final</h3>
              <div className="playoff-matches">
                {quarterFinals.map((match, index) => (
                  <div key={index} className="playoff-match">
                    {renderTeam(match.home)}
                    <div className="playoff-match-separator">vs</div>
                    {renderTeam(match.away)}
                  </div>
                ))}
              </div>
            </div>
            <div className="playoff-round">
              <h3 className="playoff-round-title">Semifinales</h3>
              <div className="playoff-matches">
                <div className="playoff-match">
                  {renderEmptyTeam()}
                  <div className="playoff-match-separator">vs</div>
                  {renderEmptyTeam()}
                </div>
                <div className="playoff-match">
                  {renderEmptyTeam()}
                  <div className="playoff-match-separator">vs</div>
                  {renderEmptyTeam()}
                </div>
              </div>
            </div>
            <div className="playoff-round">
              <h3 className="playoff-round-title">Final</h3>
              <div className="playoff-matches">
                <div className="playoff-match">
                  {renderEmptyTeam()}
                  <div className="playoff-match-separator">vs</div>
                  {renderEmptyTeam()}
                </div>
              </div>
            </div>
          </div>

          <div className="oomfropa-teaser">
            <h3>#OomfropaLeague</h3>
            <p>Proximamente...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayoffBracket; 