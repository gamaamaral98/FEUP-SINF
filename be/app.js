var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var axios = require('axios');

require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tokenRouter = require('./routes/token');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/token', tokenRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



const {token, saveToken, destroyToken} = require('./utils');

const interceptor = axios.interceptors.response.use(
  response => response,
  error => {
      // Reject promise if usual error
      if (errorResponse.status !== 401) {
          return Promise.reject(error);
      }

      /* 
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response
       */
      axios.interceptors.response.eject(interceptor);

      return token()
      .then(response => {
          saveToken();
          error.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token;
          return axios(error.response.config);
      }).catch(error => {
          destroyToken();
          this.router.push('/login');
          return Promise.reject(error);
      }).finally(createAxiosResponseInterceptor);
  }
);

module.exports = app;
