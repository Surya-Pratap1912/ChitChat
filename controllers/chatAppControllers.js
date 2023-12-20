const User = require("../models/users");
const Group = require("../models/groups");

exports.addMessage = async function (msg) {
  try {
    const time = new Date().toString();
    const group = await Group.findOne({ groupName: msg.groupName });
    const user = await User.findOne({ userName: msg.sentBy });
    if (group) {
      group.messeges.push({
        text: msg.msg,
        time: time,
        sentBy: msg.sentBy,
        receivedBy: msg.groupName,
        type: msg.type,
        groupName: msg.groupName,
        userId: user,
      });
      await group.save();
      return { status: "ok" };
    } else {
      throw { status: "user not found" };
    }
  } catch (err) {
    console.log("error adding msg in catch 1 ", err);

    throw err;
  }
};

exports.getMesseges = async (req, res, next) => {
  try {
    const { _id, userName } = req.user;
    const { name: groupName } = req.query;

    const group = await Group.findOne({ groupName: groupName });
    if (group) {
      res.status(200).json({ msgs: group.messeges, group: groupName });
    }
  } catch (err) {
    console.error("Error in getMesseges:", err);
    res.status(500).json({
      status: "internal server error",
      message: "Something went wrong in get messeges",
    });
  }
};
exports.getContacts = async (req, res, next) => {
  try {
    const { _id, userName } = req.user;
    const user = await User.findById(_id);
    const groupNames = user.groups.map((g) => g.groupName);
    res.status(200).json({ groups: groupNames, loggedUser: req.user.userName });
  } catch (err) {
    console.error("Error in getContacts:", err);
    res.status(500).json({
      status: "internal server error",
      message: "Something went wrong",
    });
  }
};

exports.createGroup = async (req, res) => {
  try {
    const { groupName } = req.body;
    const { userName } = req.user;

    const exgrp = await Group.findOne({ groupName: groupName });
    if (!exgrp) {
      const grp = new Group({
        groupName,
        admin: userName,
        messeges: [],
        users: [],
      });

      const group = await grp.save();
      await req.user.addGroup(group);
      await group.addUser(req.user);
      res.status(200).json({ groupName, createdBy: userName });
    } else
      res.status(500).json({ messege: "please choose a unique group name" });
  } catch (err) {
    console.log("err in crt grp ", err);
    res.status(500).json({ messege: "internal error" });
  }
};

exports.deleteGroup = async (req, res, next) => {
  try {
    const loggedUser = req.user;
    const { name: groupName } = req.query;
    const groupIndex = await req.user.groups.findIndex((g) => {
      return g.groupName === groupName;
    });

    if (groupIndex < 0) {
      return res.status(404).json({ message: "Group not found" });
    } else {
      const g = req.user.groups[groupIndex];
      const group = await Group.findById(g._id).populate("users");
      if (group.admin != loggedUser.userName) {
        await req.user.removeGroup(group);
        await group.removeUser(req.user);
        return res.status(200).json({
          success: true,
          message: `${loggedUser.userName} is removed from ${groupName}`,
        });
      } else {
        await Promise.all(group.users.map((user) => user.removeGroup(group)));
        await Group.findByIdAndDelete(group._id);
        return res
          .status(200)
          .json({ success: true, message: "group is successfully deleted" });
      }
    }
  } catch (err) {
    console.log("err in delete group", err);
    res.status(500).json({ success: false, messege: "internal server error" });
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const loggedUser = req.user;
    const { groupName, addUser } = req.body;

    const group = await Group.findOne({ groupName: groupName }).populate(
      "users"
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const userExists = await group.users.findIndex(
      (usr) => usr.userName === addUser
    );
    if (userExists > 0) {
      return res.status(200).json({ message: "User already exists" });
    }

    if (group.admin === loggedUser.userName) {
      const user = await User.findOne({ userName: addUser });

      if (user) {
        await user.addGroup(group);
        await group.addUser(user);
        return res
          .status(201)
          .json({ user: addUser, groupName, admin: group.admin });
      } else {
        return res.status(200).json({ message: "User not found" });
      }
    } else {
      return res.status(401).json({ message: "Only admin can add a user" });
    }
  } catch (err) {
    console.error("Error in addUser:", err);
    return res.status(500).json({
      status: "internal server error",
      message: "Something went wrong",
    });
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const group_name = req.headers["group"];
    const group = await Group.findOne({ groupName: group_name }).populate(
      "users"
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const users = await group.users;

    // Extract user names
    if (users.length > 0) {
      let userExitst = false;
      const userNames = users.map((user) => {
        if (user._id.toString() == req.user._id) userExitst = true;
        return user.userName;
      });
      if (userExitst)
        return res.status(200).json({ users: userNames, admin: group.admin });
      else
        return res
          .status(500)
          .json({
            messege:
              "you no longer have access to this group. ask admin to add you again.",
          });
    } else {
      res.status(200).json({ messege: "group has no user yet" });
    }
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({
      status: "internal server error",
      message: "Something went wrong",
    });
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const { groupName, groupUser: userName } = req.query;
    const loggedUser = req.user;
    const group = await Group.findOne({ groupName: groupName });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (userName != group.admin) {
      if (group.admin === loggedUser.userName) {
        const user = await User.findOne({ userName: userName });
        if (user) {
          await user.removeGroup(group);
          await group.removeUser(user);
          return res.status(200).json({
            success: true,
            message: `${userName} is removed from ${groupName}`,
          });
        } else {
          return res.status(401).json({ message: "User not found" });
        }
      } else {
        return res
          .status(401)
          .json({ message: "Only admin can remove a user" });
      }
    } else {
      return res.status(401).json({ message: "admin cannot be removed" });
    }
  } catch (err) {
    console.error("Error in deleteUser:", err);
    return res.status(500).json({
      status: "internal server error",
      message: "Something went wrong",
    });
  }
};
