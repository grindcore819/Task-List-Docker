const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const tasksFile = './tasks.json';

app.use(bodyParser.json());

app.get('/foo', (req, res) => {
  res.send(`Hi ${req.query.bar}`);
});

app.get('/tasks', (req, res) => {
  fs.readFile(tasksFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
    } else {
      const tasks = JSON.parse(data);
      res.send(tasks);
    }
  });
});

app.post('/tasks', (req, res) => {
  console.log(req);
  const { title } = req.body;

  if (!title) {
    res.status(400).send('Missing title');
    return;
  }
  fs.readFile(tasksFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
      return;
    }
    const tasks = JSON.parse(data);
    const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = { id, title, completed: false };
    tasks.push(newTask);
    fs.writeFile(tasksFile, JSON.stringify(tasks), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }
      res.send(newTask);
    });
  });
});

app.patch('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  if (isNaN(taskId)) {
    res.status(400).send('Invalid task ID');
    return;
  }
  const { title, completed } = req.body;
  if (title === undefined && completed === undefined) {
    res.status(400).send('Missing title and/or completed state');
    return;
  }
  fs.readFile(tasksFile, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send(err.message);
      return;
    }
    const tasks = JSON.parse(data);
    const index = tasks.findIndex(task => task.id === taskId);
    if (index === -1) {
      res.status(404).send('Task not found');
      return;
    }
    if (title !== undefined) {
      tasks[index].title = title;
    }
    if (completed !== undefined) {
      tasks[index].completed = completed;
    }
    fs.writeFile(tasksFile, JSON.stringify(tasks), 'utf8', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send(err.message);
        return;
      }
      res.send(tasks[index]);
    });
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/app.js', (req, res) => {
  res.sendFile(__dirname + '/app.js');
});

app.get('/styles.css', (req, res) => {
  res.sendFile(__dirname + '/styles.css');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});