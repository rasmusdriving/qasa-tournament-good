import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { matchupId, teamId, amount, odds } = req.body;
      const bet = await prisma.bet.create({
        data: {
          userId: session.user.id,
          matchupId,
          teamId,
          amount,
          odds,
        },
      });
      res.status(201).json(bet);
    } catch (error) {
      res.status(500).json({ message: 'Error placing bet', error });
    }
  } else if (req.method === 'GET') {
    try {
      const bets = await prisma.bet.findMany({
        where: { userId: session.user.id },
        include: {
          matchup: {
            include: {
              teamA: true,
              teamB: true,
            },
          },
          team: true,
        },
      });
      res.status(200).json(bets);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bets', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}