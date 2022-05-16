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
  describe('3. GET /api/categories', () => {
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
  describe('4. GET /api/reviews/:review_id', () => {
    test('status:200 OK, responds with review object with required properties', () => {
      return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then(({ body }) => {
          const { reviewObj } = body;
          expect(reviewObj).toBeInstanceOf(Object);
          expect(Object.keys(reviewObj)).toHaveLength(9);
          expect(reviewObj).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              category: expect.any(String),
              designer: expect.any(String),
              owner: expect.any(String),
              review_body: expect.any(String),
              review_img_url: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    test('status: 404 Not found, when the review id doesnt exist', () => {
      return request(app)
        .get('/api/reviews/101')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
    test('status:400 Bad request, when the input type is not as expected', () => {
      return request(app)
        .get('/api/reviews/abcde')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
  });
});
