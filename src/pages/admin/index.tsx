import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: session } = useSession();

  if (!session || session.user.role !== 'ADMIN') {
    return <div>Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/tournaments" className="block p-4 border rounded hover:bg-gray-100">
          <h2 className="text-2xl font-semibold">Manage Tournaments</h2>
        </Link>
        <Link href="/admin/teams" className="block p-4 border rounded hover:bg-gray-100">
          <h2 className="text-2xl font-semibold">Manage Teams</h2>
        </Link>
        <Link href="/admin/matchups" className="block p-4 border rounded hover:bg-gray-100">
          <h2 className="text-2xl font-semibold">Manage Matchups</h2>
        </Link>
      </div>
    </div>
  );
}