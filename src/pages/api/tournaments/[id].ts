import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const tournament = await prisma.tournament.findUnique({
        where: { id: String(id) },
        include: {
          teams: true,
          matchups: {
            include: {
              teamA: true,
              teamB: true,
              winner: true,
            },
          },
        },
      });

      if (!tournament) {
        return res.status(404).json({ message: 'Tournament not found' });
      }

      res.status(200).json(tournament);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tournament', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}