// Write your "actions" router here!
const express = require("express");
const { validateActionId } = require("./actions-middlware");
//
const router = express.Router();

const Actions = require("./actions-model");

router.get("/", (req, res, next) => {
  Actions.get()
    .then((actions) => res.json(actions))
    .catch(next);
});

router.get("/:id", validateActionId, (req, res) => {
  res.json(req.action);
});

router.post("/", async (req, res, next) => {
  const { project_id, description, notes } = req.body;
  try {
    if (!project_id || !description || !notes) {
      res
        .status(400)
        .json({ message: "needs both project_id and description and notes" });
    } else {
      await Actions.insert(req.body).then((newPro) =>
        res.status(201).json(newPro)
      );
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:id", (req, res, next) => {
  const { project_id, description, notes } = req.body;
  if (!project_id || !description || !notes) {
    res
      .status(400)
      .json({ message: "needs both project_id and description and notes" });
  } else {
    Actions.update(req.params.id, req.body)
      .then((newPro) => {
        res.json(newPro);
      })
      .catch(next);
  }
});

router.delete("/:id", validateActionId, async (req, res, next) => {
  const { id } = req.params;
  try {
    const proToDelete = await Actions.get(id);
    const deletedPro = await Actions.remove(id);
    deletedPro
      ? res.json(proToDelete)
      : res.status(500).json({ message: "messed up delete" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
