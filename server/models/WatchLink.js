const { Model } = require("objection");
const User = require("./User.js");

class WatchLink extends Model {
  static get tableName() {
    return "watchlink";
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "watchlink.user_id",
          to: "users.id",
        },
      },
    };
  }
}

module.exports = WatchLink;
