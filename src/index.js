const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost:27017/simple-todos', {
  useNewUrlParser: true,
});

const todoSchema = new mongoose.Schema({
  title: String,
  dateCreated: String,
  dateCompleted: String,
  completed: Boolean,
});

const ToDo = mongoose.model('todos', todoSchema);

let db = mongoose.connection;

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json({ extended: true }));
app.use(cors());

// An api endpoint that returns a list of todos
app.get('/api/getTodos', (req, res) => {
  const query = ToDo.find();
  query.sort({ completed: 1, dateCompleted: -1 });
  query.exec().then((value) => {
    res.send(JSON.stringify(value));
  });
});

app.post('/api/addTodo', (req, res) => {
  let todo = new ToDo({
    ...req.body,
    dateCreated: moment().toISOString(),
    dateCompleted: '',
    completed: false,
  });
  todo.save();
  res.status(200).send('OK');
});
app.post('/api/removeTodo', (req, res) => {
  ToDo.deleteOne(req.body.criteria, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send('OK');
    }
  });
});
app.post('/api/updateTodo', (req, res) => {
  let updated = { completed: req.body.completed };
  updated['dateCompleted'] = req.body.completed ? moment().toISOString() : '';

  ToDo.updateOne(req.body.criteria, updated, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.status(200).send('OK');
    }
  });
});

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
