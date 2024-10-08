import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { round, teamAId, teamBId, tournamentId } = req.body;
      const matchup = await prisma.matchup.create({
        data: {
          round,
          teamAId,
          teamBId,
          tournamentId,
        },
      });
      res.status(201).json(matchup);
    } catch (error) {
      res.status(500).json({ message: 'Error creating matchup', error });
    }
  } else if (req.method === 'GET') {
    try {
      const matchups = await prisma.matchup.findMany({
        include: {
          teamA: true,
          teamB: true,
          winner: true,
        },
      });
      res.status(200).json(matchups);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching matchups', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}