import express from "express";
import query from "../db/query.js";

const permission = express.Router();
//1
permission.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const permission = await query(`
        SELECT permission.permission 
        FROM permission
        JOIN permissionroles ON permissionroles.permission_id = permission.id
        JOIN role ON role.id = permissionroles.role_id
        WHERE role.id = ${id}
      `);

    res.send({ message: "success", data: permission });
  } catch (error) {
    res.status(500).send({ error });
  }
});
//2

permission.post("/", async (req, res) => {
  try {
    const { role, permission } = req.body;

    if (!role || !permission) {
      return res
        .status(400)
        .send({ error: "Role and permission are required" });
    }

    const newdata = await query(`
      INSERT INTO permissionroles (role_id, permission_id)
SELECT role.id, permission.id
FROM role
JOIN permission ON role.role= '${role}' AND permission.permission = '${permission}'`);

    res.send({ message: "success", data: newdata });
  } catch (error) {
    res.status(500).send({ error });
  }
});
//3

 permission.delete("/", async (req, res) => {
  try {
    const { role, permission } = req.body;

    if (!role || !permission) {
      return res
        .status(400)
        .send({ error: "Role name and permission name are required" });
    }

    const deleted = await query(`
      DELETE FROM permissionroles
      WHERE role_id = (SELECT id FROM role WHERE role= '${role}')
      AND permission_id = (SELECT id FROM permission WHERE permission = '${permission}')`);

    res.send({ data: deleted});
  } catch (error) {
    res.status(500).send({ error });
  }
});

//4

permission.delete("/:permission_id", async (req, res) => {
  try {
    const id = req.params.permission_id;

    console.log(id)

    const deleted = await query(`
  DELETE FROM permission WHERE id = ${id}`);

    res.status(500).send({ data: deleted });
  } catch (error) {
    res.send({ error });
  }
});
//5

permission.put("/", async (req, res) => {
  try {
    const { oldPermissionName, newPermissionName } = req.body;

    if (!oldPermissionName || !newPermissionName) {
      return res
        .status(400)
        .send({
          error: "Old permission name and new permission name are required",
        });
    }

    const updateQuery = await query(`
      UPDATE permission
      SET permission = '${oldPermissionName}'
      WHERE permission = '${newPermissionName}'`);

    res.send({ message: "success", data: updateQuery });
  } catch (error) {
    console.error("Error executing UPDATE query:", error);
    res.status(500).send({ error });
  }
});

export default permission;
