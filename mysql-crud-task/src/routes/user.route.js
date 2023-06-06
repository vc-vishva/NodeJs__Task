import express from "express";
import query from "../db/query.js";

const userRouter = express.Router();

//8
userRouter.get("/:user_id/roles", async (req, res) => {
  try {
    const { user_id } = req.params;

    const getAllRole = await query(`
      SELECT role.role
      FROM user
      JOIN role ON user.id = role.user_id
      WHERE user.id = ${user_id}`);
console.log(getAllRole, "getall role");
    res.send({ data: getAllRole });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

//9
userRouter.get("/:user_id/permissions", async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const getAllpermission = await query(`
      SELECT permission.permission
      FROM user
      JOIN role ON user.id = role.user_id
      JOIN permissionroles ON role.id = permissionroles.role_id
      JOIN permission ON permissionroles.permission_id = permission.id
      WHERE user.id = ${user_id}`);

    res.send({ data: getAllpermission });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

export default userRouter;