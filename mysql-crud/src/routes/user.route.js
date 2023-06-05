import express from "express";
import query from "../db/query.js";

 const user = express.Router();

 //8
user.get("/allrole/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    const selectQuery = await query(`
      SELECT role.role
      FROM user
      JOIN role ON user.id = role.user_id
      WHERE user.id = ${user_id}`);

    res.send({ data: selectQuery });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

//9
user.get("/allpermission/:user_id", async (req, res) => {
  try {
    const  user_id  = req.params.user_id;

    const selected = await query(`
      SELECT permission.permission
      FROM user
      JOIN role ON user.id = role.user_id
      JOIN permissionroles ON role.id = permissionroles.role_id
      JOIN permission ON permissionroles.permission_id = permission.id
      WHERE user.id = ${user_id}`);

    res.send({ data: selected });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
});

export default user;














