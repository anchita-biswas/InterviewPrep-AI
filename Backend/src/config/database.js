const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Database");
  } catch (err) {
    console.error("MongoDB Connection Error:");
    console.error(err);
    console.error("Message:", err.message);
    console.error("Name:", err.name);
    console.error("Cause:", err.cause);
  }
}

module.exports = connectToDB;
