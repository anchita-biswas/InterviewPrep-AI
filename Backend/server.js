/* explicit path so the server works no matter which directory it is started from */
require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const app = require("./src/app");
const connectToDB = require("./src/config/database");

connectToDB();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is live on port ${PORT}`);
});
