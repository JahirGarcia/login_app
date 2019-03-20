const express = require('express');
const createError = require('http-errors');
const path = require('path');
const logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const env = require('node-env-file');
const serveStatic = require('serve-static');
const passport = require('passport');
const compression = require('compression');
const auth = require('./auth/index');
const csrf = require('csurf');
const helmet = require('helmet');
const flash = require('connect-flash');

const app = express();
env(path.join(__dirname, '.env'));
auth();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const landingRouter = require('./routes/landing');

// database connection
mongoose.connect(process.env.MLAB_URI).then(() =>{
	console.log('Database connected');
}).catch(err => {
	console.error(err);
	process.exit(1);
});

// set port
app.set('port', process.env.PORT || 3000);

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares
app.use(helmet());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: true,
	saveUninitialized: true,
	key: process.env.SESSION_KEY,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf());
app.use(serveStatic(path.join(__dirname, 'public')));

// routes
app.use('/auth', authRouter);
app.use((req, res, next) => {
	if(!req.isAuthenticated()) {
		res.redirect('/auth/signin');
	} else {
		next();
	}
});
app.use('/', indexRouter);
app.use('/landing', landingRouter);

// 404 error
app.use((req, res, next) => {
	next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.render('error', {
		title: err.message,
		error: err,
	});
});

// start server
app.listen(app.get('port'), () => {
	console.log('Server on port', app.get('port'));
});
