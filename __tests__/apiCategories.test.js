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
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
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
          expect(Object.keys(reviewObj)).toHaveLength(10);
          expect(reviewObj).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: 'Agricola',
              category: 'euro game',
              designer: 'Uwe Rosenberg',
              owner: 'mallionaire',
              review_body: 'Farmyard fun!',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              created_at: '2021-01-18T10:00:20.514Z',
              votes: 1,
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
  describe('5. PATCH /api/reviews/:review_id', () => {
    test('status 200 OK, return updated object with the correct amount of votes ', () => {
      const updateVotes = { inc_votes: 5 };
      return request(app)
        .patch('/api/reviews/1')
        .send(updateVotes)
        .expect(200)
        .then(({ body }) => {
          const updatedObj = body.updatedReview;
          expect(updatedObj).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: 'Agricola',
              category: 'euro game',
              designer: 'Uwe Rosenberg',
              owner: 'mallionaire',
              review_body: 'Farmyard fun!',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              created_at: '2021-01-18T10:00:20.514Z',
              votes: 6,
            })
          );
        });
    });
    test('status 404 Not Found, when the path is correct review with that id doesnt exist', () => {
      const updateVotes = { inc_votes: 5 };
      return request(app)
        .patch('/api/reviews/101')
        .send(updateVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Review not found');
        });
    });
    test('status 400 Bad request, invalid id input type', () => {
      const updateVotes = { inc_votes: 5 };
      return request(app)
        .patch('/api/reviews/abc')
        .send(updateVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('status 400 Bad request, invalid inc_votes type', () => {
      const updateVotes = { inc_votes: 'a' };
      return request(app)
        .patch('/api/reviews/1')
        .send(updateVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('status 400 Bad request, empty object', () => {
      const updateVotes = {};
      return request(app)
        .patch('/api/reviews/1')
        .send(updateVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
    test('status 400 Bad request, incorrect key', () => {
      const updateVotes = { votes: 1 };
      return request(app)
        .patch('/api/reviews/1')
        .send(updateVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad Request');
        });
    });
  });
  describe('6. GET /api/users', () => {
    test('status 200 OK, responds with array of users objects', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
          const { usersArray } = body;
          expect(usersArray).toBeInstanceOf(Array);
          expect(usersArray.length).toBe(4);
          usersArray.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
    test('status 404 not found if the url is incorrect', () => {
      return request(app)
        .get('/api/userss')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
  });
  describe('7. Add comment_count to GET review by id ', () => {
    test('status:200 OK, responds with review object with required properties', () => {
      return request(app)
        .get('/api/reviews/1')
        .expect(200)
        .then(({ body }) => {
          const { reviewObj } = body;
          expect(reviewObj).toBeInstanceOf(Object);
          expect(Object.keys(reviewObj)).toHaveLength(10);
          expect(reviewObj).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: 'Agricola',
              category: 'euro game',
              designer: 'Uwe Rosenberg',
              owner: 'mallionaire',
              review_body: 'Farmyard fun!',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              created_at: '2021-01-18T10:00:20.514Z',
              votes: 1,
              comment_count: 0,
            })
          );
        });
    });
  });
});
