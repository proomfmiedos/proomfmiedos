function Partidos({ fixtures }) {
    return (
        <div>
            {fixtures.map((fixture, index) => (
                <div key={index}>
                    <h2>
                        {fixture.stage === 'group' && 'Grupo'}
                        {fixture.stage === 'semifinal' && 'Semifinal'}
                        {fixture.stage === 'final' && 'Final'}
                    </h2>
                    {/* Render other fixture details */}
                </div>
            ))}
        </div>
    );
}

export default Partidos; 