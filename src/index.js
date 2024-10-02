const express = require('express');
const bodyParser = require('body-parser');
const v1NoteRouter = require('./v1/routes/noteRoutes');
const v1FolderRouter = require('./v1/routes/folderRoutes');
const pool = require('./database/dbPostgresql');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const pgSession = require('connect-pg-simple')(session);
const jwt = require('jsonwebtoken');

const {
  swaggerDocs: V1SwaggerDocs,
} = require('./v1/swagger');

const GOOGLE_CLIENT_ID = '860889211205-kdmll73np5g3uno3gdhcg68fsuf6olv9.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
const JWT_SECRET = process.env.JWT_SECRET; // Замените на свой секретный ключ

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
  saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// Функция генерации JWT
const generateToken = (user) => {
  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Авторизация через Google
app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // После успешной аутентификации
    const token = generateToken(userProfile);
    console.log(token);
    res.cookie('jwt', token, { httpOnly: true }); // Храним токен в cookie
    res.redirect('/home');
  });

app.get('/home', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Извлечение токена из заголовка
  console.log(req.cookies, req.headers.authorization);
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.send({ message: 'Успешная авторизация', user: decoded });
    } catch (err) {
      res.send({ message: 'Недействительный токен' });
    }
  } else {
    res.send({ message: 'Токен не найден' });
  }
});

// Выход
app.get('/logout', (req, res) => {
  res.clearCookie('jwt'); // Удаляем cookie с токеном
  res.redirect('/');
});

// Маршруты API
app.use('/api/v1/notes', v1NoteRouter);
app.use('/api/v1/folders', v1FolderRouter);

// Обработка ошибок
app.get('/error', (req, res) => res.send("Log in first"))

// Запуск сервера
app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  V1SwaggerDocs(app, PORT);
});

// Подключение к базе данных
pool.query('SELECT NOW()', (err, res) => {
  if(err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database:', res.rows);
  }
});
