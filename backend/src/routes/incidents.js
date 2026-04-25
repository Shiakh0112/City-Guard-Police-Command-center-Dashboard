const router  = require("express").Router();
const ctrl    = require("../controllers/incidentController");
const protect = require("../middleware/auth");
const role    = require("../middleware/role");

router.use(protect); // all routes need login

// GET — admin, officer, viewer can all READ
router.get("/",      ctrl.getAll);
router.get("/stats", ctrl.getStats);

// POST — admin and officer can CREATE
router.post("/",     role("admin", "officer"), ctrl.create);

// PUT — admin and officer can UPDATE status
router.put("/:id",   role("admin", "officer"), ctrl.updateStatus);

// DELETE — only admin can DELETE
router.delete("/:id", role("admin"), ctrl.remove);

module.exports = router;
