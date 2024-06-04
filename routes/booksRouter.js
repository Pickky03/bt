const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const books = require("../models/books");

const booksRouter = express.Router();
booksRouter.use(bodyParser.json());

booksRouter
  .route("/")
  .get((req, res, next) => {
    let filter = {};

    if (req.query.price) {
      const maxPrice = parseFloat(req.query.price);
      if (!isNaN(maxPrice)) {
        filter.price = { $lte: maxPrice };
        console.log(`Filter applied: ${JSON.stringify(filter)}`);
      } else {
        const err = new Error("Invalid price value");
        err.status = 400;
        return next(err);
      }
    }

    books
      .find(filter)
      .then((books) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(books);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    books
      .create(req.body)
      .then(
        (books) => {
          console.log("books Created ", books);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(books);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /books");
  })
  .delete((req, res, next) => {
    books
      .deleteMany({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send("sach da bi xoa");
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

booksRouter
  .route("/:booksId")
  .get((req, res, next) => {
    books
      .findById(req.params.booksId)
      .then(
        (books) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(books);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /books/" + req.params.booksId);
  })
  .put((req, res, next) => {
    books
      .findByIdAndUpdate(
        req.params.booksId,
        {
          $set: req.body,
        },
        { new: true }
      )
      .then(
        (books) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(books);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    books
      .findByIdAndDelete(req.params.booksId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.send("sach da bi xoa");
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });
booksRouter
  .route("/:booksId/comments")
  .get((req, res, next) => {
    books
      .findById(req.params.booksId)
      .then(
        (books) => {
          if (books != null) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(books.comments);
          } else {
            err = new Error("books " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    books
      .findById(req.params.booksId)
      .then(
        (books) => {
          if (books != null) {
            books.comments.push(req.body);
            books.save().then(
              (books) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(books);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("books " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /books/" +
        req.params.booksId +
        "/comments"
    );
  })
  .delete((req, res, next) => {
    books
      .findById(req.params.booksId)
      .then(
        (books) => {
          if (books != null) {
            for (var i = books.comments.length - 1; i >= 0; i--) {
              books.comments.id(books.comments[i]._id).remove();
            }
            books.save().then(
              (books) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(books);
              },
              (err) => next(err)
            );
          } else {
            err = new Error("books " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

booksRouter
  .route("/:booksId/comments/:commentId")
  .get((req, res, next) => {
    books
      .findById(req.params.booksId)
      .then(
        (books) => {
          if (
            books != null &&
            books.comments.id(req.params.commentId) != null
          ) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(books.comments.id(req.params.commentId));
          } else if (books == null) {
            err = new Error("books " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /books/" +
        req.params.booksId +
        "/comments/" +
        req.params.commentId
    );
  })
  .put((req, res, next) => {
    books
      .findById(req.params.booksId)
      .then(
        (books) => {
          if (
            books != null &&
            books.comments.id(req.params.commentId) != null
          ) {
            if (req.body.rating) {
              books.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
              books.comments.id(req.params.commentId).comment =
                req.body.comment;
            }
            books.save().then(
              (books) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(books);
              },
              (err) => next(err)
            );
          } else if (books == null) {
            err = new Error("books " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    books
      .findById(req.params.booksId)
      .then(
        (books) => {
          if (
            books != null &&
            books.comments.id(req.params.commentId) != null
          ) {
            books.comments.pull(req.params.commentId);
            books.save().then(
              (books) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.send("comment da bi xoa");
              },
              (err) => next(err)
            );
          } else if (books == null) {
            err = new Error("books " + req.params.booksId + " not found");
            err.status = 404;
            return next(err);
          } else {
            err = new Error("Comment " + req.params.commentId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = booksRouter;
