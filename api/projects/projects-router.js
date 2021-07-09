// Write your "projects" router here!
const express = require("express");
//
const { validateProjectId, validateProject } = require("./projects-middleware");
//
const router = express.Router();
const Projects = require("./projects-model");

router.get("/", (req, res, next) => {
  Projects.get()
    .then((projects) => res.json(projects))
    .catch(next);
});

router.get("/:id", validateProjectId, (req, res) => {
  res.json(req.project);
});

router.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  try {
    if (!name || !description) {
      res.status(400).json({ message: "needs both name and description" });
    } else {
      await Projects.insert(req.body).then((newPro) =>
        res.status(201).json(newPro)
      );
    }
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  validateProject,
  validateProjectId,
  async (req, res, next) => {
    const { id } = req.params;
    const projectToUpdate = req.body;

    try {
      const updatedProject = await Projects.update(id, projectToUpdate);
      updatedProject
        ? res.status(200).json(updatedProject)
        : res.status(500).json({ message: "Update failed, please try again" });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", validateProjectId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const proToDelete = await Projects.get(id);
    const deletedPro = await Projects.remove(id);
    deletedPro
      ? res.json(proToDelete)
      : res.status(500).json({ message: "messed up delete" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/actions", validateProjectId, async (req, res, next) => {
  // const { id } = req.params.id;
  // Projects.getProjectActions(id)
  //   .then((projects) => {
  //     res.json(projects);
  //   })
  //   .catch(next);
  try {
    const actions = await Projects.getProjectActions(req.params.id);
    res.json(actions);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res) => {
  res.status(err.status || 500).json({
    customMessage: "something broke in projects router",
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
