const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Item = require("./models/list.js");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/todoListDb");
}

main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log(err));

const quotes = [
  "The journey of a thousand miles begins with one step.",
  "Don't watch the clock; do what it does. Keep going.",
  "The secret of getting ahead is getting started.",
  "Well done is better than well said.",
  "The future depends on what you do today.",
];

app.get("/", async (req, res) => {
  try {
    const savedItem = await Item.find({});
    let randomQuote = null;
    if (savedItem.length === 0) {
      randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    }
    res.render("list", { savedItem, quote: randomQuote });
  } catch (err) {
    console.log(err);
    res.send("An error occurred");
  }
});

app.post("/", async (req, res) => {
  try {
    const newItem = new Item({
      name: req.body.listItem,
    });
    await newItem.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.send("An error occurred");
  }
});

app.post("/delete", async (req, res) => {
  try {
    let id = req.body.check;
    let show = await Item.findByIdAndDelete(id);
    console.log(show);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
