const {v4: uuid} = require("uuid");
const DB = require('./db.json');
const { saveToDatabase } = require('./utils')

const data = [];
const date = new Date();

for (let i = 0; i < 15; i++) {
  const note = {
    id: uuid(),
    name: `Note ${i + 1}`,
    content: `This is the content for note ${i + 1}.`,
    createdAt: date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    updatedAt: date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
  data.push(note);
  DB.notes = data;
  saveToDatabase(DB);
}