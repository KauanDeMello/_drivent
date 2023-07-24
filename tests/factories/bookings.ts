import faker from 'faker';
import { Prisma } from '@prisma/client';

export const createBookingParams = (): Prisma.BookingCreateInput => {
  return {
    userId: faker.datatype.number(),
    roomId: faker.datatype.number(),
  };
};



import request from 'supertest';
import app from '@/app';
import { createBookingParams } from '../factories/booking';
import { prisma } from '@/config';

describe('Booking Routes', () => {
  afterEach(async () => {
    await prisma.booking.deleteMany();
  });

  it('should get booking by user', async () => {
    const bookingParams = createBookingParams();

    
    await prisma.booking.create({ data: bookingParams });

    
    const authToken = 'YOUR_AUTH_TOKEN'; 

    const response = await request(app)
      .get('/booking')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Verifique o corpo da resposta
    expect(response.body).toHaveProperty('id', bookingParams.id);
    expect(response.body).toHaveProperty('Room');
  });

  it('should return 404 when user has no booking', async () => {
   
    const authToken = 'YOUR_AUTH_TOKEN'; 
    const response = await request(app)
      .get('/booking')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);

    // Verifique o corpo da resposta
    expect(response.body).toEqual({});
  });

  it('should create booking for valid user', async () => {
    
    const authToken = 'YOUR_AUTH_TOKEN'; 

    const bookingParams = createBookingParams();

    const response = await request(app)
      .post('/booking')
      .set('Authorization', `Bearer ${authToken}`)
      .send(bookingParams)
      .expect(201);

    // Verifique o corpo da resposta
    expect(response.body).toHaveProperty('id');
  });

  it('should return 400 when user does not meet booking requirements', async () => {

    const authToken = 'YOUR_AUTH_TOKEN'; 

    
    const invalidUserId = 9999;

    const response = await request(app)
      .post('/booking')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ userId: invalidUserId, roomId: 1 })
      .expect(400);


    expect(response.body).toEqual({});
  });
});