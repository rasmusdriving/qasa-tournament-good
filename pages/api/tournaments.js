import db from '../../lib/db';

export default function handler(req, res) {
  const tournaments = db.prepare('SELECT * FROM tournaments WHERE isPublic = 1 ORDER BY createdAt DESC').all();
  res.status(200).json(tournaments);
}