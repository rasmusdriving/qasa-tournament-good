import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Tournament } from '@prisma/client';

export default function AdminTournaments() {
  const { data: session } = useSession();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [newTournament, setNewTournament] = useState({ name: '', description: '', isPublic: false, isPromoted: false });

  useEffect(() => {
    fetch('/api/admin/tournaments')
      .then((res) => res.json())
      .then((data) => setTournaments(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTournament),
    });
    if (res.ok) {
      const createdTournament = await res.json();
      setTournaments([...tournaments, createdTournament]);
      setNewTournament({ name: '', description: '', isPublic: false, isPromoted: false });
    }
  };

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Manage Tournaments</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          placeholder="Tournament Name"
          value={newTournament.name}
          onChange={(e) => setNewTournament({ ...newTournament, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTournament.description}
          onChange={(e) => setNewTournament({ ...newTournament, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <label className="mr-2">
          <input
            type="checkbox"
            checked={newTournament.isPublic}
            onChange={(e) => setNewTournament({ ...newTournament, isPublic: e.target.checked })}
          />
          Public
        </label>
        <label className="mr-2">
          <input
            type="checkbox"
            checked={newTournament.isPromoted}
            onChange={(e) => setNewTournament({ ...newTournament, isPromoted: e.target.checked })}
          />
          Promoted
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Tournament</button>
      </form>

      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.id} className="mb-4 p-4 border rounded">
            <h2 className="text-2xl font-semibold">{tournament.name}</h2>
            <p>{tournament.description}</p>
            <p>Public: {tournament.isPublic ? 'Yes' : 'No'}</p>
            <p>Promoted: {tournament.isPromoted ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}