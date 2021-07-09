// add middlewares here related to projects
const Projects = require("../projects/projects-model");
async function validateProjectId(req, res, next) {
  const id = req.params.id || req.body.project_id;
  try {
    const project = await Projects.get(id);
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  } catch (err) {
    next(err);
  }
}

function validateProject(req, res, next) {
  const { name, description } = req.body;

  if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "Missing project data" });
  } else if (!name || !description) {
    res.status(400).json({ message: "Missing required field" });
  } else {
    next();
  }
}

module.exports = {
  validateProjectId,
  validateProject,
};
