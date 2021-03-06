var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
var cors = require("cors");

require("dotenv").config();

require("./db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tokenRouter = require("./routes/token");
var loginRouter = require("./routes/login");
var signupRouter = require("./routes/signup");
var logoutRouter = require("./routes/logout");
var warehouseRouter = require("./routes/warehouses");
var purchasesRouter = require("./routes/purchases");
var salesRouter = require("./routes/sales");
var itemRouter = require("./routes/item");
var pickingWaveRouter = require("./routes/pickingWave");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// initialize express-session to allow us track the logged-in user across sessions
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false
  })
);

// middleware function to check for logged-in users
var requiresLogin = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    var err = new Error("You must be logged in");
    err.status = 401;
    return next(err);
  }
};

app.use("/", indexRouter);
app.use("/users", requiresLogin, usersRouter);
app.use("/token", requiresLogin, tokenRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/logout", requiresLogin, logoutRouter);
app.use("/warehouses", warehouseRouter);
app.use("/purchases", purchasesRouter);
app.use("/sales", salesRouter);
app.use("/item", itemRouter);
app.use("/pickingWaves", pickingWaveRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).end(err.message);
});

require("./utils/token_setup");

module.exports = app;
