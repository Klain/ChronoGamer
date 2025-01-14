//tests\app.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('Debería registrar un nuevo usuario', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'password123',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('Debería autenticar un usuario', async () => {
    const res = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'password123',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});

describe('Games API', () => {
  it('Debería devolver juegos para una fecha específica', async () => {
    const res = await request(app)
      .get('/api/games?date=1998-11-21')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
