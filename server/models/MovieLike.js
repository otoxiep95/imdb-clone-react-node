const { Model } = require("objection");
const User = require("./User.js");
class MovieLike extends Model {
  static get tableName() {
    return "movielike";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movielike.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = MovieLike;
