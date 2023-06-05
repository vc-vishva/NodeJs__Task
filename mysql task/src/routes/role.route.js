import express from "express";
import query from "../db/query.js";

const role = express.Router();
 //6

role.put("/", async (req, res) => {
  try {
    const { oldRoleName, newRoleNAme } = req.body;

    if (!oldRoleName || !newRoleNAme) {
      return res.status(400).send({
        error: "Old permission name and new permission name are required",
      });
    }

    const updateQuery = await query(`
      UPDATE role
      SET role = '${newRoleNAme}'
      WHERE role = '${oldRoleName}'`);

    res.send({ message: "success", data: updateQuery });
  } catch (error) {
    console.error("Error executing UPDATE query:", error);
    res.status(500).send({ error });
  }
});

//7
role.delete("/:role_id", async (req, res) => {
  try {
    const id = req.params.role_id;
    console.log(id);

    const deleted = await query(`
        DELETE FROM role WHERE id = '${id}'`);
    res.status(200).send({ data: deleted });
  } catch (error) {
    res.send({ error });
  }
});

export default role;
