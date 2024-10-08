import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const { name, members, tournamentId } = req.body;
      const team = await prisma.team.create({
        data: {
          name,
          members,
          tournamentId,
        },
      });
      res.status(201).json(team);
    } catch (error) {
      res.status(500).json({ message: 'Error creating team', error });
    }
  } else if (req.method === 'GET') {
    try {
      const teams = await prisma.team.findMany();
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teams', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};