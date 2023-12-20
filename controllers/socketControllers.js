const User = require("../models/users");
const chatAppControllers = require("./chatAppControllers");
const S3Services = require("../services/s3services");
const multer = require("multer");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

let USERS = new Map();

const joinMe = async (userName) => {
  try {
    const user = await User.findOne({ userName: userName });

    if (user) {
      const groups = await user.groups;
      return groups;
    } else {
      return [];
    }
  } catch (error) {
    console.log("Error in joinMe:", error);
    throw error;
  }
};

const sockets = (io) => {
  io.on("connection", (socket) => {
    USERS.set("");
    socket.emit("connected", { messege: "connected" });
    socket.on("connected", async ({ user }) => {
      // console.log('usered',user);
      USERS.set(user, socket.id);
      const groups = await joinMe(user);
      groups.forEach((group) => {
        socket.join(group.groupName);
      });
    });

    socket.on("group-created", (user, group) => {
      socket.join(group);
    });
    socket.on("user-added", async ({ grp, usr }) => {
      const id = USERS.get(usr);
      const my_socket = io.sockets.sockets.get(id);
      if (my_socket) my_socket.join(grp);
      socket.to(grp).emit("user-added", grp, usr);
    });
    socket.on("remove-user", async ({ groupName, groupUser }) => {
      const id = USERS.get(groupUser);
      const my_socket = io.sockets.sockets.get(id);
      if (my_socket) {
        my_socket.leave(groupName);
        my_socket.emit("user-removed", groupUser, groupName);
      }
      socket.to(groupName).emit("user-removed", groupUser, groupName);
    });
    socket.on("sent-messege", async (msg) => {
      try {
        const save = await chatAppControllers.addMessage(msg);
        if (save.status == "ok") {
          socket.to(msg.groupName).emit("received-msg", msg);
        } else {
          socket.emit("error", {
            error: `failed to add message, ${save.status}`,
          });
        }
      } catch (error) {
        console.error("Error in handling sent-message:", error);
        socket.emit("error", {
          error: "Internal server error in sent messege",
        });
      }
    });

    socket.on("mms", async (data) => {
      const { fileName, buffer, type, sentBy, time, groupName } = data;
      const maxRetries = 3;

      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          const fileUrl = await S3Services.uploadtos3(
            fileName,
            buffer,
            type,
            time
          );

          if (fileUrl) {
            const save = await chatAppControllers.addMessage({
              msg: `${fileName} ${fileUrl}`,
              time,
              sentBy,
              groupName,
              type,
            });

            if (save.status == "ok")
              socket.to(groupName).emit("mms", {
                fileUrl,
                fileName,
                type,
                sentBy,
                time,
                groupName,
              });
            else {
              socket.emit("error", {
                error: `failed to add messege , ${save.status}`,
              });
            }
          }
        } catch (error) {
          console.error(
            `Error uploading to S3 (attempt ${attempt + 1}):`,
            error
          );

          attempt++;
          await sleep(1000);
        }
      }

      if (attempt === maxRetries) {
        socket.emit("error", {
          error: `Failed to upload to S3 after ${attempt + 1} attempts`,
        });
      }
    });

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    socket.on("disconnect", () => {
      console.log("disconnected");
    });
  });
};

module.exports = {
  sockets,
};
