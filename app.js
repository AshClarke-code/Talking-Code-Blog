const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const latestArr = [1, 2, 3, 4];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/TalkingCodeDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const postSchema = new mongoose.Schema({
title: {
  type: String,
  required: "Title cannot be empty."
},
content: {
  type: String,
  required: "Content cannot be empty."
},
created_date: {
  type: Date,
  default: Date.now
}

});

const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
res.render("home", {latestArr: latestArr});
});


app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/about", (req, res) => {
res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", (req, res) => {
res.render("contact", {contactContent: contactContent});
});

app.get("/posts", (req, res) => {

  Post.find({}, function(err, posts){
    res.render("all-posts", {
      posts: posts
    });
  });

});

app.post("/compose", (req, res) => {
  const postTitle = req.body.postTitle;
  const postContent = req.body.postBody;

  const post = new Post({
    title: postTitle,
    content: postContent
  });
  // console.log(post._id);

  post.save((err) => {
    if(!err){
      res.redirect("/");
    } else {
      alert("That did not work");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  Post.findById(req.params.postId, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });
});


app.listen(3000, () => {
  console.log("Server started on port 3000");
});
