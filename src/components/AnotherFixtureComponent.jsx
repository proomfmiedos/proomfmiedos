const AnotherFixtureComponent = () => {
  // ... existing code ...

  return (
    <div className="fixture-list">
      {fixturesData.matches.map((match) => {
        const homeTeam = teamsData.teams[match.homeTeamId];
        const awayTeam = teamsData.teams[match.awayTeamId];

        return (
          <div key={match.id} className="fixture-item">
            <div className="fixture-teams">
              <div className="fixture-team">
                <img src={homeTeam.image} alt={homeTeam.name} />
                <span>{homeTeam.name}</span>
              </div>
              <div className="fixture-vs">
                {match.status === "Completed" ? `${match.homeScore} - ${match.awayScore}` : "vs"}
              </div>
              <div className="fixture-team">
                <img src={awayTeam.image} alt={awayTeam.name} />
                <span>{awayTeam.name}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnotherFixtureComponent; 