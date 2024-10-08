import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Matchup, Team, Tournament } from '@prisma/client';

type MatchupWithTeams = Matchup & {
  teamA: Team;
  teamB: Team;
  winner: Team | null;
};

export default function AdminMatchups() {
  const { data: session } = useSession();
  const [matchups, setMatchups] = useState<MatchupWithTeams[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newMatchup, setNewMatchup] = useState({ round: 1, teamAId: '', teamBId: '', tournamentId: '' });

  useEffect(() => {
    fetch('/api/admin/matchups')
      .then((res) => res.json())
      .then((data) => setMatchups(data));
    fetch('/api/admin/tournaments')
      .then((res) => res.json())
      .then((data) => setTournaments(data));
    fetch('/api/admin/teams')
      .then((res) => res.json())
      .then((data) => setTeams(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/matchups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMatchup),
    });
    if (res.ok) {
      const createdMatchup = await res.json();
      setMatchups([...matchups, createdMatchup]);
      setNewMatchup({ round: 1, teamAId: '', teamBId: '', tournamentId: '' });
    }
  };

  const handleWinnerUpdate = async (matchupId: string, winnerId: string) => {
    const res = await fetch(`/api/admin/matchups/${matchupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winnerId }),
    });
    if (res.ok) {
      const updatedMatchup = await res.json();
      setMatchups(matchups.map((m) => (m.id === updatedMatchup.id ? updatedMatchup : m)));
    }
  };

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Manage Matchups</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="number"
          placeholder="Round"
          value={newMatchup.round}
          onChange={(e) => setNewMatchup({ ...newMatchup, round: parseInt(e.target.value) })}
          className="border p-2 mr-2"
        />
        <select
          value={newMatchup.teamAId}
          onChange={(e) => setNewMatchup({ ...newMatchup, teamAId: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Team A</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <select
          value={newMatchup.teamBId}
          onChange={(e) => setNewMatchup({ ...newMatchup, teamBId: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Team B</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name}</option>
          ))}
        </select>
        <select
          value={newMatchup.tournamentId}
          onChange={(e) => setNewMatchup({ ...newMatchup, tournamentId: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Tournament</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Matchup</button>
      </form>

      <ul>
        {matchups.map((matchup) => (
          <li key={matchup.id} className="mb-4 p-4 border rounded">
            <h2 className="text-2xl font-semibold">Round {matchup.round}</h2>
            <p>{matchup.teamA.name} vs {matchup.teamB.name}</p>
            <p>Tournament: {tournaments.find((t) => t.id === matchup.tournamentId)?.name}</p>
            {matchup.winner ? (
              <p>Winner: {matchup.winner.name}</p>
            ) : (
              <div>
                <button
                  onClick={() => handleWinnerUpdate(matchup.id, matchup.teamA.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  {matchup.teamA.name} Wins
                </button>
                <button
                  onClick={() => handleWinnerUpdate(matchup.id, matchup.teamB.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  {matchup.teamB.name} Wins
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}