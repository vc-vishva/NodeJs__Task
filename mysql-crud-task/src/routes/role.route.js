import express from "express";
import query from "../db/query.js";

const roleRouter = express.Router();

//1 get all permission for roles
roleRouter.get("/:role_id/permissions", async (req, res) => {
  try {
    const id = req.params.role_id;
    const getPermission = await query(`
        SELECT permission.permission 
        FROM permission
        JOIN permissionroles ON permissionroles.permission_id = permission.id
        JOIN role ON role.id = permissionroles.role_id
        WHERE role.id = ${id}
      `);

    res.status(200).send({ message: "success", data: getPermission });
  } catch (error) {
    res.status(500).send({ error });
  }
});

//2 add permision
roleRouter.post("/permission", async (req, res) => {
  try {
    const{ role_id  ,permission_id} = req.body;
    
    const newPermission = await query(`
      INSERT INTO permissionroles (role_id, permission_id)
      SELECT role.id, permission.id
      FROM role
      JOIN permission ON role.id= '${role_id}' AND permission.id = '${permission_id}'`);

    res.status(200).send({ message: "success", data: newPermission });
  } catch (error) {
    res.status(500).send({ error });
  }
});

//3 
roleRouter.delete("/permission", async (req, res) => {

  try {
    const {role_id ,permission_id } = req.body
   
    const deletePermission = await query(`
    DELETE FROM permissionroles
     WHERE role_id = (SELECT id FROM role WHERE id = '${role_id}')
     AND permission_id = (SELECT id FROM permission WHERE id = '${permission_id}')`);

    res.status(200).send({ message: "success", data: deletePermission });
  } catch (error) {
    res.status(500).send({ error });
  }
});

//6
roleRouter.put("/:role_id", async (req, res) => {
 
  try {
    const { newRoleName } = req.body;
    const id = req.params.role_id;
    
    const updaterole = await query(`
      UPDATE role
      SET role = '${newRoleName}'
      WHERE id = ${id}`);

    res.status(200).send({ message: "success", data: updaterole });
  } catch (error) {
    console.error("Error executing UPDATE query:", error);
    res.status(500).send({ error });
  }
});

//7
roleRouter.delete("/:role_id", async (req, res) => {
  try {
    const id = req.params.role_id;
    
    const deleteRole = await query(`
    DELETE FROM role WHERE id = '${id}'`);
    console.log(deleteRole);
    if (deleteRole.affectedRows === 0)
      return res.status(404).send({ error: "not found" });

    res.status(200).send({ data: deleteRole });
  } catch (error) {
    res.status(500).send({ error });
  }
});

export default roleRouter;