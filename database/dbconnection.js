const mongoose = require("mongoose");
const DB = "PASTE_YOUR_URL_INSIDE_THIS_DOUBLE_QUOTES";

mongoose
  .connect(DB)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log(err);
  });
