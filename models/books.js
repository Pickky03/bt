const { default: mongoose } = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;
const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const booksSchema = new Schema(
  {
    isbn: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    publish_date: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      default: "",
    },
    pages: {
        type: String,
        default: "",
      },
    price: {
      type: Currency,
      required: true,
      min: 0,
    },
    description: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
    comments: [commentSchema],
    genres: {
        type: String,
        default: "",
    },
  },
  {
    timestamps: true,
  }
);
var books = mongoose.model("books", booksSchema);
module.exports = books;
