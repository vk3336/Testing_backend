const express = require("express");
const router = express.Router();
const roleManagementController = require("../controller/roleManagementController");
const superAdmin = require("../middleware/superAdmin");

// Get all roles
router.get("/", superAdmin, roleManagementController.getAllRoles);

// Get one role by ID
router.get("/:id", superAdmin, roleManagementController.getRoleById);

// Create a new role
router.post("/", superAdmin, roleManagementController.createRole);

// Update a role
router.put("/:id", superAdmin, roleManagementController.updateRole);

// Delete a role
router.delete("/:id", superAdmin, roleManagementController.deleteRole);

module.exports = router;
