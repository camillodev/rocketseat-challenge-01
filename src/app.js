const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/projects/:id', validateProjectId);

const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'invalid Project ID.'})
  }
  
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;
  const repository = { id: uuid(), url, title, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;
  const index = repositories.findIndex(repo => repo.id === id);

  if(index < 0) {
    return response.status(400).json({error: "Bad Request"});
  }

  repositories[index] = { id, url, title, techs, likes: repositories[index].likes };
  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex(repo => repo.id === id);
  repositories.splice(index, 1);
  if(index < 0) {
    return response.status(400).json({error: "Bad Request"});
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
    const { id } = request.params;
    const index = repositories.findIndex(repo => repo.id === id);
    if(index < 0) {
      return response.status(400).json({error: "Repository does not exists."});
    }
    repositories[index].likes += 1;

    return response.json(repositories[index]);
});

module.exports = app;
