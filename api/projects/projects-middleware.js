// add middlewares here related to projects
const Projects = require("../projects/projects-model");

async function validateProjectId(req, res, next) {
  try {
    const project = await Projects.get(req.params.id);
    if (!project) {
      res.status(404).json({
        message: "no project exists",
      });
    } else {
      req.project = project;
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: " cant find project id",
    });
  }
}

module.exports = { validateProjectId };
