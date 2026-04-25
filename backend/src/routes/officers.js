const router  = require("express").Router();
const ctrl    = require("../controllers/officerController");
const protect = require("../middleware/auth");
const role    = require("../middleware/role");

router.use(protect);

router.get("/",       ctrl.getAll);                          // all roles can read
router.put("/:id",    role("admin", "officer"), ctrl.updateStatus); // admin + officer
router.delete("/:id", role("admin"), ctrl.remove);           // admin only

// Note: POST / (create officer) is handled via /api/admin/create-officer
// because it also creates a User account at the same time

module.exports = router;
