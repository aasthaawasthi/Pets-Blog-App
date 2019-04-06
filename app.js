var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({useNewUrlParser: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", (req, res) => {
    res.redirect("/blogs");
})

//INDEX ROUTES
app.get("/blogs", (req, res) => {
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else{
            res.render("index", {blogs: blogs});
        }
    })    
})

//NEW ROUTES
app.get("/blogs/new", (req, res) => {
    res.render("new")
})

//CREATE ROUTES
app.post("/blogs", (req, res) => {
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, (err, newBlog) => {
        if(err){
            res.render("new");
        } else{
            //them redirect to the index
            res.redirect("/blogs");
        }
    })  
})

// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
   Blog.findById(req.params.id, (err, foundBlog) => {
       if(err){
           res.redirect("/blogs")
       } else{
           res.render("show", {blog: foundBlog})
       }
   })
})

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if(err){
            res.redirect("/blogs")
        } else{
            res.render("edit", {blog: foundBlog})
        }
    }) 
})

//UPDAT ROUTE
app.put("/blogs/:id",(req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err){
            res.redirect("/blogs")
        } else{
            res.redirect("/blogs/" + req.params.id)
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    // Destroy blog
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/blogs")
        } else{
            res.redirect("/blogs")
        }
    })
    // redirect somewhere 
})

app.listen(3000, process.env.IP, () => {
    console.log("SERVER IS RUNNING!!");
})