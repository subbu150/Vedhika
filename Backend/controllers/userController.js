import User from "../models/User.js";



// get all users (admin)
export const getUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};



// get single user
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
};



// delete user (admin)
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

export const updateUserRole = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    console.log("the Request sent");
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }



    /* =================================
       1️⃣ prevent self role change
    ================================= */
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot change your own role"
      });
    }



    /* =================================
       2️⃣ allow only valid roles
    ================================= */
    const allowedRoles = ["participant", "organizer", "admin"];

    if (!allowedRoles.includes(req.body.role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }



    /* =================================
       3️⃣ prevent removing last admin
    ================================= */
    if (targetUser.role === "admin" && req.body.role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });

      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Cannot remove last admin"
        });
      }
    }



    /* =================================
       4️⃣ update
    ================================= */
    targetUser.role = req.body.role;
    await targetUser.save();



    res.json({
      message: "Role updated successfully",
      user: targetUser
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

