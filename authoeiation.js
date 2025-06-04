const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/User");

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "chat_secret_key",
  resave: false,
  saveUninitialized: false,
}));

// Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.send("Username already exists.");

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  req.session.user = user;
  res.redirect("/");
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.send("Invalid credentials");
  }
  req.session.user = user;
  res.redirect("/");
});

// Middleware to check login
app.use((req, res, next) => {
  if (req.session.user || req.path === "/login" || req.path === "/register") {
    next();
  } else {
    res.redirect("/login.html");
  }
});
