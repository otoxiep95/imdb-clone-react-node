// Include Model
const { Model } = require("objection");
// Step 4 from test.js moved here
class User extends Model {
  static get tableName() {
    return "users";
  }
}
// Export User class
module.exports = User;
