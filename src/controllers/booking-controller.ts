import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { prisma } from '@/config';
import { notFoundError } from '@/errors';

export async function getBookingByUser(req: Request, res: Response) {
  const userId = req.userId;

  const booking = await prisma.booking.findFirst({
    where: { userId },
    include: { Room: true },
  });

  if (!booking) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }

  return res.status(httpStatus.OK).json({ id: booking.id, Room: booking.Room });
}

export async function createBooking(req: Request, res: Response) {
  const userId = req.userId;


  const ticket = await prisma.ticket.findFirst({
    where: { userId, type: 'presencial', hasAccommodation: true, status: 'paid' },
  });

  if (!ticket) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }


  const roomId = 'ROOM_ID'; // Substitua pelo ID do quarto selecionado

  // Criar a reserva
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });

  return res.status(httpStatus.CREATED).json({ id: booking.id });
}