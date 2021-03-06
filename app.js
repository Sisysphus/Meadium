const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')
  (session.Store);

const {
  sequelize
} = require('./db/models');
const store = new SequelizeStore({
  db: sequelize,
});

const {
  restoreUser
} = require('./auth');
const {
  sessionSecret
} = require('./config');
const indexRouter = require('./routes/index');
const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const profileRouter = require('./routes/profile');
const storyRouter = require('./routes/story');
const apiRouter = require('./routes/api/api');
const homeRouter = require('./routes/home')
const createStoryRouter = require('./routes/create')


const app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser(sessionSecret));
app.use(session({
  store: store,
  name: 'Meadium.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    //   httpOnly: true,
    // maxAge: 60000,
    //   path: '/',
    //   secure: true
  }
}));
store.sync();
app.use(express.static(path.join(__dirname, 'public')));
app.use(restoreUser);
app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/Assets', express.static('Assets'))
app.use('/stories', storyRouter);
app.use('/api', apiRouter);
app.use('/home', homeRouter);
app.use('/profile/stories', createStoryRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
