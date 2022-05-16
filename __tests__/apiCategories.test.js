const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const testData = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed');
beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  if (db.end) db.end();
});

describe('APIs', () => {
  ////
  describe('1. GET /api/categories', () => {
    test('status:200, responds with an array of categories objects', () => {
      return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body }) => {
          const { categories } = body;
          expect(categories).toBeInstanceOf(Array);
          expect(categories).toHaveLength(4);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    test('status 404 not found if the url is incorrect', () => {
      return request(app)
        .get('/api/categorie')
        .expect(404)
        .then(() => {});
    });
  });
  ////

});
