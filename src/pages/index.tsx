import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Tournament } from '@prisma/client';

export default function Home() {
  const { data: session } = useSession();
  const [promotedTournament, setPromotedTournament] = useState<Tournament | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    async function fetchTournaments() {
      const res = await fetch('/api/tournaments');
      const data = await res.json();
      setTournaments(data.filter((t: Tournament) => t.isPublic));
      setPromotedTournament(data.find((t: Tournament) => t.isPromoted) || null);
    }
    fetchTournaments();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Sports Tournament Framework</h1>
      {promotedTournament && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Featured Tournament</h2>
          <Link href={`/tournaments/${promotedTournament.id}`} className="block p-4 border rounded hover:bg-gray-100">
            <h3 className="text-xl font-medium">{promotedTournament.name}</h3>
            <p>{promotedTournament.description}</p>
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map((tournament) => (
          <Link key={tournament.id} href={`/tournaments/${tournament.id}`} className="block p-4 border rounded hover:bg-gray-100">
            <h3 className="text-xl font-medium">{tournament.name}</h3>
            <p>{tournament.description}</p>
          </Link>
        ))}
      </div>
      {session?.user.role === 'ADMIN' && (
        <div className="mt-8">
          <Link href="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Admin Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}