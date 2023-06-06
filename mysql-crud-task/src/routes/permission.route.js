import express from "express";
import query from "../db/query.js";

const permissionRoutes = express.Router();

permissionRoutes.delete("/:permission_id", async (req, res) => {
  try {
    const id = req.params.permission_id;

    console.log(id);

    const deletePermission = await query(`
    DELETE FROM permission WHERE id = ${id}`);
    if (deletePermission.affectedRows === 0)
    return res.status(404).send({ error: "not found" });
    res.status(500).send({ data: deletePermission });
  } catch (error) {
    res.send({ error });
  }
});
//5 update permission

permissionRoutes.put("/:permission_id", async (req, res) => {
  try {
    const { newPermissionName } = req.body;
    const id = req.params.permission_id;
    
    const updatePermission = await query(`
      UPDATE permission
      SET permission = '${newPermissionName}'
      WHERE id = ${id}`);

    res.send({ message: "success", data: updatePermission });
  } catch (error) {
    console.error("Error executing UPDATE query:", error);
    res.status(500).send({ error });
  }
});

export default permissionRoutes;
