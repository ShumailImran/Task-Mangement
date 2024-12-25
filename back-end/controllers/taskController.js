import Task from "../models/taskModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// // // // CREATE_TASK // // // // //
export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, team, stage, date, priority } = req.body;

    // Ensure the team is an array of ObjectIds
    let teamArray = Array.isArray(team) ? team : JSON.parse(team);

    // Form the text for notification
    let text = "New task has been assigned to you";
    if (teamArray?.length > 1) {
      text = text + ` and ${teamArray?.length - 1} others.`;
    }

    text =
      text +
      ` The task priority is set as ${priority} priority, so check and act accordingly. The task date is ${new Date(
        date
      ).toDateString()}. Thank you!!!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    // Initialize assets array to store Cloudinary URLs
    let assets = [];

    if (req.files) {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "auto" }, (error, result) => {
              if (error) {
                return reject(error);
              }
              // Push the uploaded file URL to the assets array
              assets.push(result?.secure_url);
              resolve();
            })
            .end(file.buffer);
        });
      });

      // Wait for all uploads to finish
      await Promise.all(uploadPromises);
    }

    // Create the task with the data, including assets
    const task = await Task.create({
      title,
      team: teamArray, // team is now an array of ObjectIds
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets, // Contains URLs of uploaded files
      activities: activity,
    });

    // Create a notification for the assigned task
    await Notification.create({
      team: teamArray, // Notify all team members
      text,
      task: task._id,
    });

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // // // DUPLICATE_TASK // // // // //

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    const newTask = await Task.create({
      ...task,
      title: task.title + " - Duplicate",
    });

    newTask.team = task.team;
    newTask.subTasks = task.subTasks;
    newTask.assets = task.assets;
    newTask.priority = task.priority;
    newTask.stage = task.stage;

    await newTask.save();

    // ALERT USER OF THE TASK

    let text = "New task has been assigned to you";

    if (task.team.length > 1) {
      text = text + `and ${task.team.length - 1} others.`;
    }

    text =
      text +
      `The task priority is set a ${
        task.priority
      } priority, so check and act accordingly. The task date is ${task.date.toDateString()}. Thank you!!!`;

    await Notification.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({ status: true, message: "Task duplicated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // // // POST_TASK_ACTIVITY // // // // //

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // // // DASHBOARD_STATISTICS // // // // //

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const allTasks = isAdmin
      ? await Task.find({
          isTrashed: false,
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 })
      : await Task.find({
          isTrashed: false,
          team: { $all: [userId] },
        })
          .populate({
            path: "team",
            select: "name role title email",
          })
          .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    //   GROUP TASK BY STAGE AND CALCULTE COUNTS

    const groupTask = allTasks.reduce((result, task) => {
      const stage = task.stage;

      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }

      return result;
    }, {});

    // GROUP TASK BY PRIORITY

    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;

        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    // CALCULATE TOTAL TASKS
    const totalTasks = allTasks.length;
    const last10Task = allTasks.slice(0, 10);

    const summary = {
      totalTasks,
      last10Task,
      user: isAdmin ? users : [],
      tasks: groupTask,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      ...summary,
      message: "Successfully retrieved",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // // // GET_TASKS // // // // //

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed ? true : false };

    if (stage) {
      query.stage = stage;
    }

    let queryResult = Task.find(query)
      .populate({
        path: "team",
        select: "name title email",
      })
      .sort({ _id: -1 });

    const tasks = await queryResult;

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // // // GET_SINGLE_TASK // // // // //

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({
        path: "team",
        select: "name title role email",
      })
      .populate({
        path: "activities.by",
        select: "name",
      })
      .sort({ _id: -1 });

    res.status(200).json({ status: true, task });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // // // CREATE_SUB_TASK // // // // //

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.params;

    console.log("Task ID:", id); // Log the task ID to ensure it's available

    if (!id) {
      return res
        .status(400)
        .json({ status: false, message: "Task ID is required" });
    }

    const newSubTasks = {
      title,
      date,
      tag,
    };

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    task.subTasks.push(newSubTasks);

    await task.save();

    res
      .status(201)
      .json({ status: true, message: "Sub task created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// // // // UPDATE_TASK // // // // //

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Task ID" });
    }

    const { title, team, date, stage, priority, assets } = req.body;

    // Parse `team` if it's a string
    let teamArray = Array.isArray(team) ? team : team ? JSON.parse(team) : [];

    // Fetch the task by ID
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    // Update task fields
    task.title = title || task.title;
    task.team = teamArray.length > 0 ? teamArray : task.team; // Only update if provided
    task.date = date || task.date;
    task.stage = stage ? stage.toLowerCase() : task.stage;
    task.priority = priority ? priority.toLowerCase() : task.priority;

    // Handle new files if provided
    let updatedAssets = assets || task.assets;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream({ resource_type: "auto" }, (error, result) => {
                if (error) {
                  return reject(error);
                }
                resolve(result.secure_url);
              })
              .end(file.buffer);
          })
      );

      const uploadedFiles = await Promise.all(uploadPromises);
      updatedAssets = [...updatedAssets, ...uploadedFiles];
    }

    task.assets = updatedAssets;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: false, message: "Cannot update Task" });
  }
};

// // // // TRASH_TASK // // // // //
export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    task.isTrashed = true;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task trashed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const restore = await Task.findById(id);

      restore.isTrashed = false;
      restore.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res
      .status(200)
      .json({ status: true, message: "Operation performed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
