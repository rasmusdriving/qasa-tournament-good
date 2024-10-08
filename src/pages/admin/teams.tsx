import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Team, Tournament } from '@prisma/client';

export default function AdminTeams() {
  const { data: session } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [newTeam, setNewTeam] = useState({ name: '', members: '', tournamentId: '' });
  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('/api/admin/teams')
      .then((res) => res.json())
      .then((data) => setTeams(data));
    fetch('/api/admin/tournaments')
      .then((res) => res.json())
      .then((data) => setTournaments(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newTeam,
        members: newTeam.members.split(',').map((m) => m.trim()),
      }),
    });
    if (res.ok) {
      const createdTeam = await res.json();
      setTeams([...teams, createdTeam]);
      setNewTeam({ name: '', members: '', tournamentId: '' });
    }
  };

  const handleCsvUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile) return;

    const formData = new FormData();
    formData.append('file', csvFile);

    const res = await fetch('/api/admin/teams/bulk-upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const uploadedTeams = await res.json();
      setTeams([...teams, ...uploadedTeams]);
      setCsvFile(null);
    }
  };

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Manage Teams</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Team Name"
          value={newTeam.name}
          onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Team Members (comma-separated)"
          value={newTeam.members}
          onChange={(e) => setNewTeam({ ...newTeam, members: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newTeam.tournamentId}
          onChange={(e) => setNewTeam({ ...newTeam, tournamentId: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Select Tournament</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Team</button>
      </form>

      <form onSubmit={handleCsvUpload} className="mb-8">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setCsvFile(e.target.files ? e.target.files[0] : null)}
          className="mr-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Upload CSV</button>
      </form>

      <ul>
        {teams.map((team) => (
          <li key={team.id} className="mb-4 p-4 border rounded">
            <h2 className="text-2xl font-semibold">{team.name}</h2>
            <p>Members: {team.members.join(', ')}</p>
            <p>Tournament: {tournaments.find((t) => t.id === team.tournamentId)?.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}