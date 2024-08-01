const express = require('express');
const bodyParser = require('body-parser');
const v1NoteRouter = require('./v1/routes/noteRoutes');
const v1FolderRouter = require('./v1/routes/folderRoutes');
const pool = require('./database/dbPostgresql');

const {
  swaggerDocs: V1SwaggerDocs,
} = require('./v1/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/v1/notes', v1NoteRouter);
app.use('/api/v1/folders', v1FolderRouter);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  V1SwaggerDocs(app, PORT);
});

pool.query('SELECT NOW()', (err, res) => {
  if(err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Connected to the database:', res.rows);
  }
});