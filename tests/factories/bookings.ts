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

  describe('POST /booking', () => {
    it('should return 200 and bookingId if roomId is valid and room has available capacity', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'Quarto Teste',
          capacity: 3, 
        },
      });
  
      const response = await request(app)
        .post('/booking')
        .send({
          roomId: room.id,
        });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });
  
    it('should return 404 if roomId does not exist', async () => {
      const response = await request(app)
        .post('/booking')
        .send({
          roomId: 9999, // ID inválido
        });
  
      expect(response.status).toBe(404);
    });
  
    it('should return 403 if room does not have available capacity', async () => {
      const room = await prisma.room.create({
        data: {
          name: 'Quarto Teste',
          capacity: 0;
        },
      });
  
      const response = await request(app)
        .post('/booking')
        .send({
          roomId: room.id,
        });
  
      expect(response.status).toBe(403);
    });
  
    it('should return 403 if user does not meet booking requirements', async () => {
      
    });
  });
  
  describe('PUT /booking/:bookingId', () => {
    it('should return 200 and updated booking data if roomId is valid and room has available capacity', async () => {
      const room1 = await prisma.room.create({
        data: {
          name: 'Quarto Teste 1',
          capacity: 3, 
        },
      });
  
      const room2 = await prisma.room.create({
        data: {
          name: 'Quarto Teste 2',
          capacity: 3, 
        },
      });
  
      const booking = await prisma.booking.create({
        data: {
          userId: 1, 
          roomId: room1.id, 
        },
      });
  
      const response = await request(app)
        .put(`/booking/${booking.id}`)
        .send({
          roomId: room2.id,
        });
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
    });
  
    it('should return 404 if bookingId does not exist', async () => {
      const response = await request(app)
        .put('/booking/9999')
        .send({
          roomId: 1, 
        });
  
      expect(response.status).toBe(404);
    });
  
    it('should return 404 if roomId does not exist', async () => {
      const booking = await prisma.booking.create({
        data: {
          userId: 1, 
          roomId: 1, 
        },
      });
  
      const response = await request(app)
        .put(`/booking/${booking.id}`)
        .send({
          roomId: 9999,
        });
  
      expect(response.status).toBe(404);
    });
  
    it('should return 403 if room does not have available capacity', async () => {
      const room1 = await prisma.room.create({
        data: {
          name: 'Quarto Teste 1',
          capacity: 3, 
        },
      });
  
      const room2 = await prisma.room.create({
        data: {
          name: 'Quarto Teste 2',
          capacity: 0, 
        },
      });
  
      const booking = await prisma.booking.create({
        data: {
          userId: 1, 
          roomId: room1.id, 
        },
      });
  
      const response = await
});