const RoleManagement = require("../model/RoleManagement");

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await RoleManagement.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get one role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await RoleManagement.findById(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, email, filter, product, seo } = req.body;
    const newRole = new RoleManagement({ name, email, filter, product, seo });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a role
exports.updateRole = async (req, res) => {
  try {
    const { name, email, filter, product, seo } = req.body;
    const updatedRole = await RoleManagement.findByIdAndUpdate(
      req.params.id,
      { name, email, filter, product, seo },
      { new: true, runValidators: true }
    );
    if (!updatedRole) return res.status(404).json({ error: "Role not found" });
    res.json(updatedRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const deletedRole = await RoleManagement.findByIdAndDelete(req.params.id);
    if (!deletedRole) return res.status(404).json({ error: "Role not found" });
    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
