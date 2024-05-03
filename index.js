const status = require('./message/status');
const express = require("express");
const app = express();
const config = require('./config');
const userRouter = require("./routes/user.router");
const adminRouter = require('./routes/admin.router');

app.use(express.json());
app.use("/api/v1", userRouter);
app.use('/admin', adminRouter);

app.get("/", function (req, res) {
  res.status(status.nStatusSuccess).send("Welcome!!");
});

app.listen(config.PORT, () => {
  console.log(`Server is listening on http://localhost:${config.PORT}`);
});

