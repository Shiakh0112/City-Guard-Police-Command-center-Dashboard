const router  = require("express").Router();
const ctrl    = require("../controllers/adminController");
const protect = require("../middleware/auth");
const role    = require("../middleware/role");

router.use(protect);
router.use(role("admin")); // all routes below require admin

router.get("/users",                  ctrl.getAllUsers);
router.put("/users/:id/role",         ctrl.changeRole);
router.delete("/users/:id",           ctrl.deleteUser);
router.post("/create-officer",        ctrl.createOfficerWithAccount);

module.exports = router;
