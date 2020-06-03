const { Model } = require("objection");
const User = require("./User.js");

class Review extends Model {
  static get tableName() {
    return "review";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "review.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = Review;
