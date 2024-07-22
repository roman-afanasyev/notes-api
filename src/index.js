const express = require('express');
const bodyParser = require('body-parser');
const v1NoteRouter = require('./v1/routes/noteRoutes');

const {
  swaggerDocs: V1SwaggerDocs,
} = require('./v1/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/v1/notes', v1NoteRouter);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
  V1SwaggerDocs(app, PORT);
});