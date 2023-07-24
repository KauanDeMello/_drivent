import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { prisma } from '@/config';
import { notFoundError } from '@/errors';

export async function getBookingByUser(req: Request, res: Response) {
  const userId = req.userId;

  async function createBooking(req: Request, res: Response) {
    const { userId } = req;
    const { roomId } = req.body;
  
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        Booking: true,
      },
    });
  
    if (!room) {
      throw new NotFoundError('Quarto não encontrado.');
    }
  
    if (room.capacity <= room.Booking.length) {
      throw new ForbiddenError('Quarto sem vaga disponível.');
    }
  
 
    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId,
      },
    });
  
    return res.status(httpStatus.OK).json({
      id: booking.id,
    });
  }
  
  async function updateBooking(req: Request, res: Response) {
    const { userId } = req;
    const { bookingId } = req.params;
    const { roomId } = req.body;
  
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        Booking: true,
      },
    });
  
    if (!room) {
      throw new NotFoundError('Quarto não encontrado.');
    }
  
    if (room.capacity <= room.Booking.length) {
      throw new ForbiddenError('Quarto sem vaga disponível.');
    }
  

  
    const booking = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        roomId,
      },
    });
  
    return res.status(httpStatus.OK).json({
      id: booking.id,
    });
  }
  
  export { createBooking, updateBooking };