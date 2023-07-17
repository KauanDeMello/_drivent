import faker from '@faker-js/faker';
import { prisma } from '@/config';

describe('GET /hotels', () => {
    it('should return a list of hotels', async () => {
      const response = await request().get('/hotels');
      expect(response.status).toBe(200);
    });
  });