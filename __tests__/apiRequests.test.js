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
          expect(reviewObj).toEqual(
            expect.objectContaining({
              comment_count: 0,
            })
          );
        });
    });
  });
  describe('8. GET /api/reviews responds with reviews array of objects', () => {
    test(`status 200 OK, responds with reviews array of objects, containing
    all the required properties, sorted by created_at in descending order`, () => {
      return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
          const { reviewsArr } = body;
          expect(reviewsArr).toHaveLength(13);
          expect(reviewsArr).toBeSorted({ descending: true });
          expect(reviewsArr[4]).toEqual(
            expect.objectContaining({
              review_id: 3,
              title: 'Ultimate Werewolf',
              category: 'social deduction',
              owner: 'bainesface',
              review_img_url:
                'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
              created_at: '2021-01-18T10:01:41.251Z',
              votes: 5,
              comment_count: 3,
            })
          );
        });
    });
  });
  describe('9. /api/reviews/:review_id/comments responds with', () => {
    test('status 200 OK , returns an array of comments of the given review_id', () => {
      return request(app)
        .get('/api/reviews/3/comments')
        .expect(200)
        .then(({ body: { commentsArray } }) => {
          expect(commentsArray.length).toBe(3);
          commentsArray.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                review_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
    test('status 200 OK, valid review_id but no comments with that refference', () => {
      return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then(({ body: { commentsArray } }) => {
          expect(commentsArray.length).toBe(0);
        });
    });
    test('status 404, valid number but not matching any review_id', () => {
      return request(app)
        .get('/api/reviews/1001/comments')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Comments not found');
        });
    });
    test('status 400, invalid type review_id', () => {
      return request(app)
        .get('/api/reviews/abcd/comments')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad Request');
        });
    });
  });
  describe('10. POST /api/reviews/:review_id/comments', () => {
    test('Status 201 Created,responds with the posted comment', () => {
      const newComment = {
        username: 'bainesface',
        body: 'Lorem ipsum',
      };
      return request(app)
        .post('/api/reviews/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body: { addedComment } }) => {
          expect(addedComment).toEqual(
            expect.objectContaining({
              comment_id: 7,
              body: 'Lorem ipsum',
              review_id: 1,
              author: 'bainesface',
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
    test('Status 400 Bad request, the comment does not contain both mandatory keys', () => {
      const newComment = { body: 'Down the rabbit hole' };
      return request(app)
        .post('/api/reviews/1/comments')
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad Request');
        });
    });
    test('Status 400  Bad request, non-numerical review_id', () => {
      const newComment = {
        username: 'bainesface',
        body: 'Lorem ipsum',
      };
      return request(app)
        .post('/api/reviews/abc/comments')
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad Request');
        });
    });
    test('Status 404 Not Found, no such review with that id', () => {
      const newComment = { username: 'bainesface', body: 'Lorem Ipsum' };
      return request(app)
        .post('/api/review/1001/comments')
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Not found');
        });
    });
    test('Status 404 Not Found, user not in the database ', () => {
      const newComment = {
        username: 'Donev',
        body: 'Am I testing the code or is it testing me',
      };
      return request(app)
        .post('/api/reviews/1/comments')
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('User not found');
        });
    });
  });
  describe('11. GET /api/reviews (queries)', () => {
    describe('status 200 OK', () => {
      test('sort_by query returns status 200 OK and an array of sorted articles by valid column', () => {
        return request(app)
          .get(`/api/reviews?sort_by=review_id`)
          .expect(200)
          .then(({ body: { reviewsArr } }) => {
            expect(reviewsArr.length).toBe(13);
            expect(reviewsArr[0].review_id === 13).toBe(true);
          });
      });
      test('category query returns 200 OK, returns an array of reviews with that category sorted by default ', () => {
        return request(app)
          .get('/api/reviews?category=social deduction')
          .expect(200)
          .then(({ body: { reviewsArr } }) => {
            reviewsArr.forEach((review) => {
              expect(review.category === 'social deduction');
            });
          });
      });
      test(`order_by query returns 200 OK, returns an array of reviews sorted by created_at and in ASC or DESC order`, () => {
        return request(app)
          .get('/api/reviews?order_by=asc')
          .expect(200)
          .then(({ body: { reviewsArr } }) => {
            expect(reviewsArr[0].created_at).toBe('1970-01-10T02:08:38.400Z');
          });
      });
      test('returns valid array if all three queries are chained', () => {
        return request(app)
          .get('/api/reviews?category=dexterity&sort_by=review_id&order_by=ASC')
          .expect(200)
          .then(({ body: { reviewsArr } }) => {
            expect(reviewsArr[0]).toEqual(
              expect.objectContaining({
                owner: 'philippaclaire9',
                title: 'Jenga',
                review_id: 2,
                category: 'dexterity',
                review_img_url:
                  'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: 5,
                comment_count: 3,
              })
            );
          });
      });
      test('200 but no reviews from that category', () => {
        return request(app)
          .get(`/api/reviews?category=children's games`)
          .expect(200)
          .then(({ body: { reviewsArr } }) => {
            expect(reviewsArr).toEqual([]);
          });
      });
    });
    describe('status 404 / 400', () => {
      test('404 user enters non-existent category', () => {
        return request(app)
          .get('/api/reviews?category=ala-bala')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Category not found');
          });
      });
      test('400 wrong input for sort_by', () => {
        return request(app)
          .get('/api/reviews?sort_by=nonsense')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Wrong input');
          });
      });
      test('400 wrong input for order_by', () => {
        return request(app)
          .get('/api/reviews?order_by=bananas')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Wrong input');
          });
      });
    });
  });
  describe('12. DELETE /api/comments/:comment_id', () => {
    describe('responds with status 204 and no content', () => {
      test('deletes the comment with that id', () => {
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
        .then(({body})=>{
expect(body).toEqual({})
        })
      });
    });
    describe('responds with statuses 404/400 if comment_id doesnt exist or wrong input type', () => {
      test('responds with 400 if id is not a number ', () => {
        return request(app)
        .delete('/api/comments/abcde')
        .expect(400)
        .then(({body:{msg}})=>{
          expect(msg).toBe('Wrong input type')
        })
      });
      test('responds with 404 if comment with that id doesnt exist', () => {
        return request(app)
        .delete('/api/comments/10001')
        .expect(404)
        .then(({body:{msg}})=>{
          expect(msg).toBe('Comment not found')
        })
      });
    });
  });
  describe('13 GET /api', () => {
    test('status 200 OK , returns JSON object with info', () => {
      return request(app)
      .get('/api')
      .expect(200)
      .then(({body:{data}})=>{
       expect(data).toBeInstanceOf(Object)
      })
    });
  });
});
