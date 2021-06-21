const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      require: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },

    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      require: true,
    },

    body: {
      type: String,
      required: true,
    },

    depth: {
      type: Number,
      default: 1,
    },

    isDeleted: {
      // 2
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

CommentSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});

CommentSchema.virtual("childComments")
  .get(function () {
    return this._childComments;
  })
  .set(function (v) {
    this._childComments = v;
  });

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
