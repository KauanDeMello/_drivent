import request from 'supertest';


describe('GET /hotels', () => {
  it('should return a list of hotels', async () => {
    const response = await request(app).get('/hotels');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(/* Expected response body with list of hotels */);
  });
});