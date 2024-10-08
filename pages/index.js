import { useState, useEffect } from 'react'

export default function Home() {
  const [tournaments, setTournaments] = useState([])

  useEffect(() => {
    fetch('/api/tournaments')
      .then(res => res.json())
      .then(data => setTournaments(data))
  }, [])

  return (
    <div>
      <h1>Tournament Framework</h1>
      <ul>
        {tournaments.map((tournament) => (
          <li key={tournament.id}>{tournament.name}</li>
        ))}
      </ul>
    </div>
  )
}