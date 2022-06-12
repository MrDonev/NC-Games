const db = require('../db/connection');

exports.fetchReviewById = (reviewID) => {
  return db
    .query(
      `SELECT reviews.*, COUNT (
      comments.body
    ) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id=comments.review_id
    WHERE reviews.review_id=$1 
    GROUP BY reviews.review_id`,
      [reviewID]
    )
    .then((result) => {
      if (result.rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      const reviewObj = { ...result.rows[0] };
      reviewObj.comment_count = Number(reviewObj.comment_count);
      return reviewObj;
    });
};

exports.updateReviewById = (reviewId, updateVotes) => {
  if (updateVotes === undefined) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(
      `UPDATE reviews 
      SET votes=votes + $1 
      WHERE review_id=$2 
      RETURNING *`,
      [updateVotes, reviewId]
    )
    .then((result) => {
      const updatedObj = result.rows[0];
      if (!updatedObj) {
        return Promise.reject({ status: 404, msg: 'Review not found' });
      }
      return result.rows[0];
    });
};

exports.fetchAllReviews = (
  category,
  sort_by = 'created_at',
  order_By = 'DESC'
) => {
  const order_by = order_By.toUpperCase();
  const availableSortColumns = [
    'owner',
    'title',
    'review_id',
    'category',
    'created_at',
    'votes',
    'comment_count',
  ];
  const availableOrderBy = ['ASC', 'DESC'];

  if (
    !availableOrderBy.includes(order_by) ||
    !availableSortColumns.includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: 'Wrong input' });
  }

  let queryStr = `SELECT 
  reviews.owner,
  reviews.title,
  reviews.review_id,
  reviews.category,
  reviews.review_img_url,
  reviews.created_at,
  reviews.votes,
  COUNT (comments.body)::INT AS comment_count 
  FROM reviews
  LEFT JOIN comments 
    ON reviews.review_id=comments.review_id `;

  const queryVals = [];
  if (!category) {
    queryStr += ` 
    GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order_by}`;
  } else {
    queryStr += ` 
    WHERE reviews.category=$1 
    GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order_by}`;
    queryVals.push(category);
  }
  const tableQuery = db.query(queryStr, queryVals);
  const allCategories = db.query(`SELECT * FROM categories`);

  return allCategories
    .then(({ rows }) => {
      if (
        !rows.map((obj) => obj.slug).includes(category) &&
        category !== undefined
      ) {
        return Promise.reject({ status: 404, msg: 'Category not found' });
      }
    })
    .then(() => {
      return tableQuery;
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchReviewCommentsById = (id) => {
  const reviewId = db.query(
    `SELECT review_id FROM reviews WHERE review_id=$1`,
    [id]
  );
  const commentsById = db.query(`SELECT * FROM comments WHERE review_id=$1`, [
    id,
  ]);
  return Promise.all([reviewId, commentsById]).then(
    ([reviewData, commentsData]) => {
      if (reviewData.rows.length > 0 && commentsData.rows.length > 0) {
        return commentsData.rows;
      } else if (reviewData.rows.length > 0 && commentsData.rows.length === 0) {
        return [];
      } else {
        return Promise.reject({ status: 404, msg: 'Comments not found' });
      }
    }
  );
};

exports.addCommentByReviewId = (reviewId, newComment) => {
  if (!Object.keys(newComment).includes('username', 'body')) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(
      `
  INSERT INTO comments (body, review_id, author, votes)
  VALUES ($1, $2, $3,$4)
  RETURNING *;`,
      [newComment.body, reviewId, newComment.username, 0]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.addNewReview = (newReview) => {
  if (
    !Object.keys(newReview).includes(
      'title',
      'category',
      'designer',
      'owner',
      'review_body',
      'review_img_url'
    )
  ) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }
  return db
    .query(
      `
  INSERT INTO reviews (title, category, designer, owner,review_body,review_img_url)
  VALUES ($1, $2, $3,$4,$5,$6)
  RETURNING *;`,
      [
        newReview.title,
        newReview.category,
        newReview.designer,
        newReview.owner,
        newReview.review_body,
        newReview.review_img_url,
      ]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeReviewById = (reviewId) => {
  if (isNaN(reviewId)) {
    return Promise.reject({ status: 400, msg: 'Wrong input type' });
  }
  reviewId = Number(reviewId);
  return db
    .query(`SELECT review_id FROM reviews`)
    .then(({ rows }) => {
      if (!rows.map((review) => review.review_id).includes(reviewId)) {
        return Promise.reject({ status: 404, msg: 'Review not found' });
      }
    })
    .then(() => {
      return db.query(`DELETE FROM comments WHERE review_id=$1`, [reviewId]);
    })
    .then(() => {
      return db.query(`DELETE FROM reviews WHERE review_id=$1`, [reviewId]);
    })
    .then(({ rows }) => {
      return rows;
    });
};
