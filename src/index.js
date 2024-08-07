const express = require('express');
const bodyParser = require('body-parser');
const v1NoteRouter = require('./v1/routes/noteRoutes');
const v1FolderRouter = require('./v1/routes/folderRoutes');
const pool = require('./database/dbPostgresql');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const pgSession = require('connect-pg-simple')(session);

const {
  swaggerDocs: V1SwaggerDocs,
} = require('./v1/swagger');

const GOOGLE_CLIENT_ID = '860889211205-kdmll73np5g3uno3gdhcg68fsuf6olv9.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

let userProfile;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
  store: new pgSession({
    pool, // Подключение к базе данных
    tableName: 'session', // Имя таблицы для хранения сессий
    createTableIfMissing: true, // Создать таблицу, если она отсутствует
    pruneSessionInterval: 24 * 60 * 60 // Интервал очистки просроченных сессий
  }),
  secret: 'my super secret word kgb',
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile=profile;
    return done(null, userProfile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

app.use(bodyParser.json());
app.use('/api/v1/notes', v1NoteRouter);
app.use('/api/v1/folders', v1FolderRouter);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  V1SwaggerDocs(app, PORT);
});

app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect to home.
    res.redirect('/home');
  });

app.get('/home', (req, res) => {
  console.log(userProfile);
  res.send(userProfile);
})
app.get('/error', (req, res) => res.send("Log in first"))

app.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    userProfile = undefined;
    res.redirect('/');
  });
});

pool.query('SELECT NOW()', (err, res) => {
  if(err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database:', res.rows);
  }
});