import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Tournament, Matchup, Team } from '@prisma/client';

type TournamentWithDetails = Tournament & {
  teams: Team[];
  matchups: (Matchup & {
    teamA: Team;
    teamB: Team;
    winner: Team | null;
  })[];
};

export default function TournamentPage() {
  const router = useRouter();
  const { id } = router.query;
  const [tournament, setTournament] = useState<TournamentWithDetails | null>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/tournaments/${id}`)
        .then((res) => res.json())
        .then((data) => setTournament(data));
    }
  }, [id]);

  if (!tournament) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">{tournament.name}</h1>
      <p className="mb-8">{tournament.description}</p>

      <h2 className="text-2xl font-semibold mb-4">Teams</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tournament.teams.map((team) => (
          <li key={team.id} className="p-4 border rounded">
            <h3 className="text-xl font-medium">{team.name}</h3>
            <p>Members: {team.members.join(', ')}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mb-4">Bracket</h2>
      <div className="space-y-4">
        {tournament.matchups.map((matchup) => (
          <div key={matchup.id} className="p-4 border rounded">
            <h3 className="text-xl font-medium">Round {matchup.round}</h3>
            <p>{matchup.teamA.name} vs {matchup.teamB.name}</p>
            {matchup.winner && <p>Winner: {matchup.winner.name}</p>}
            {/* Add betting functionality here */}
          </div>
        ))}
      </div>
    </div>
  );
}