// add middlewares here related to actions
const Actions = require("../actions/actions-model");

async function validateActionId(req, res, next) {
  try {
    const action = await Actions.get(req.params.id);
    if (!action) {
      res.status(404).json({
        message: "no action exists",
      });
    } else {
      req.action = action;
      next();
    }
  } catch (err) {
    res.status(500).json({
      message: " cant find action id",
    });
  }
}

module.exports = { validateActionId };
