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
      const { name, description, isPublic, isPromoted } = req.body;
      const tournament = await prisma.tournament.create({
        data: {
          name,
          description,
          isPublic,
          isPromoted,
        },
      });
      res.status(201).json(tournament);
    } catch (error) {
      res.status(500).json({ message: 'Error creating tournament', error });
    }
  } else if (req.method === 'GET') {
    try {
      const tournaments = await prisma.tournament.findMany();
      res.status(200).json(tournaments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tournaments', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}