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
      SELECT DISTINCT permission.permission
      FROM permission
      JOIN permissionroles ON permission.id = permissionroles.permission_id
      JOIN role ON permissionroles.role_id = role.id 
      JOIN user ON role.user_id = user.id
      WHERE user.id = ${user_id}`);

    res.send({ data: getAllpermission });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

export default userRouter;