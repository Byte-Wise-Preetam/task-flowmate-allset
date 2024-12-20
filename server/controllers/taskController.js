var mongoose = require('mongoose');
const Task = require("../models/task");
const User = require("../models/user");
const cloudinary = require('cloudinary').v2;

// Parent route     >>>>     /api/tasks/

// create a new task    /tasks/  POST
const createNewTask = async function(req, res, next){
    try{
        const user = req.user;

        const { title, description, priority, lastDate, team  } = req.body;

        const taskAdmin = user._id;

        const newTask = new Task({title, description, priority: priority.toLowerCase(), taskAdmin, team, lastDate});

        console.log("newTask", newTask);
        await newTask.save();

        await User.findByIdAndUpdate(taskAdmin, { $push: {tasks: newTask._id} });

        if(team && team.length>0){
            const teamMemberIds = team.map(member => member.memberId);

            await User.updateMany(
                { _id: { $in: teamMemberIds } }, 
                { $push: { assignedTasks: newTask._id } }  
            );
        }

        const populatedTask = await Task.findById(newTask._id)
            .populate('taskAdmin', 'firstName lastName email')
            .populate({
                path: 'team.memberId',
                select: 'firstName lastName'
            }); 

        return res.status(201).json({
            status: true,
            message: "Task Created Successfully",
            newTask: populatedTask
        })
    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
}

// create Activity    /tasks/:id/activity   PUT
const createActivity = async function(req, res, next){
    try{
        // const userId = req.user;
        const userId = req.user._id;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "No task found" 
            })
        }

        if(task.isTrashed){
            return res.status(404).json({
                status: false,
                message: "Trashed Task" 
            })
        }

        if(task.status === "inQueue"){
            return res.status(404).json({
                status: false,
                message: "Task is not active" 
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);
        const isMember = task.team.some((member) => member.memberId.equals(userId));

        if(!isAdmin && !isMember){
            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        const { title, tag } = req.body;

        const allowedTags = ["started", "assigned", "in progress", "bug", "completed", "commented"];
        if (!allowedTags.includes(tag)) {
            return res.status(400).json({
                status: false,
                message: "Invalid tag value"
            });
        }

        const newActivity = {
            title,
            tag,
            by: userId
        } 

        task.activities.push(newActivity);

        await task.save();

        const updatedTask = await Task.findById(taskId).
            populate({
                path: 'activities.by',
                select: 'firstName lastName email'
            });

        return res.status(200).json({
            status: true,
            message: "Activity added succesfully",
            updatedActivities: updatedTask.activities
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

//  Upload new asset  /tasks/:id/asset     PUT
const uploadAsset = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;
        const { display_name, asset_id, public_id, url, format, resource_type, bytes, created_at, width, height } = req.body; 
        const assetPublicId= public_id;

        const task = await Task.findById(taskId);

        if(!task){
            await cloudinary.uploader.destroy(assetPublicId, {resource_type: resource_type});

            return res.status(404).json({
                status: false,
                message: "No task found" 
            })
        }

        if(task.isTrashed){
            await cloudinary.uploader.destroy(assetPublicId, {resource_type: resource_type});

            return res.status(404).json({
                status: false,
                message: "Trashed Task" 
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);
        const isMember = task.team.some((member) => member.memberId.equals(userId));

        if(!isAdmin && !isMember){
            await cloudinary.uploader.destroy(assetPublicId, {resource_type: resource_type});

            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        const newAsset = { by:userId, filename: display_name,asset_id, public_id, url, format, resource_type, bytes, created_at, width, height };

        task.assets.push(newAsset);

        await task.save();

        const updatedTask = await Task.findById(taskId);

        return res.status(200).json({
            status: true,
            message: "Asset uploaded succesfully",
            updatedAssets: updatedTask.assets
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

//  Delete asset  /tasks/:id/asset/:assetId     DELETE
const deleteAsset = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;
        const assetPublicId = req.params.assetId;
        const { resource_type } = req.body;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "No task found" 
            })
        }

        if(task.isTrashed){
            return res.status(404).json({
                status: false,
                message: "Trashed Task" 
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);
        let isAssetOwner = false;
        
        for(const asset of task.assets){
            if(asset.public_id === assetPublicId && asset.by.equals(userId)){
                isAssetOwner = true;
                break ;
            }
        }

        if(!isAdmin && !isAssetOwner){
            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        // Delete the asset from Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.destroy(assetPublicId, {resource_type: resource_type});

        if (cloudinaryResponse.result !== "ok") {
            return res.status(400).json({
                status: false,
                message: "Failed to delete the asset from Cloudinary",
                cloudinaryResponse
            });
        }

        task.assets = task.assets.filter((asset) => asset.public_id !== assetPublicId);

        await task.save();

        const updatedTask = await Task.findById(taskId);

        return res.status(200).json({
            status: true,
            message: "Asset Deleted succesfully",
            updatedAssets: updatedTask.assets
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// Start Task    /tasks/:id/start   PUT
const startTask = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "No task found" 
            })
        }

        if(task.isTrashed || task.status !== "inqueue"){
            return res.status(404).json({
                status: false,
                message: "Invalid Action" 
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);
        const isMember = task.team.some((member) => member.memberId.equals(userId));

        if(!isAdmin && !isMember){
            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        task.status = "active";

        await task.save();

        res.status(200).json({
            status: true,
            message: "Task started succesfully"
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// Mark Task as Completed   /tasks/:id/completed   PUT
const markCompleted = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "No task found" 
            })
        }

        if(task.isTrashed || task.status === "completed"){
            return res.status(404).json({
                status: false,
                message: "Invalid action" 
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);
        const isMember = task.team.some((member) => member.memberId.equals(userId));

        if(!isAdmin && !isMember){
            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        task.status = "completed";

        await task.save();

        res.status(200).json({
            status: true,
            message: "Task completed succesfully"
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// get all tasks   /tasks/  GET       
const getAllTasks = async function(req, res, next){
    try{
        const user = req.user;

        if(!user.tasks.length && !user.assignedTasks.length){
            return res.status(200).json({
                status: true,
                message: "no tasks found",
                tasks: []
            })
        }

        const allTaskIds = [...user.tasks, ...user.assignedTasks];

        const tasks = await Task.find({
            _id: { $in: allTaskIds }
        })
        .populate('taskAdmin', 'firstName lastName email')
        .populate({
            path: 'team.memberId',
            select: 'firstName lastName'
        })
        .populate({
            path: 'activities.by',
            select: 'firstName lastName email'
        });

        return res.status(200).json({
            status: true,
            message: "Tasks fetched successfully",
            tasks
        });

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
}

// get task bt ID   /tasks/:id  GET
const getTask = async function(req, res, next){
    try{
        const taskId = req.params.id;
        const userId = req.user._id;

        const task = await Task.findById(taskId)
        .populate('taskAdmin', 'firstName lastName email')
        .populate({
            path: 'team.memberId',
            select: 'firstName lastName'
        })
        .populate({
            path: 'activities.by',
            select: 'firstName lastName email'
        });

        if(!task){
            return res.status(404).json({
                status:false, 
                message: "no trashed tasks found"
            });
        }

        const isAdmin = task.taskAdmin._id.equals(userId);
        const isTeamMember = task.team.some((member) => member.memberId.equals(userId));

        if(!isAdmin && !isTeamMember){
            return res.status(404).json({
                status:false, 
                message: "You are not authorized to view this task"
            });
        }

        console.log("Reached checkpoint");

        return res.status(200).json({
            status: true,
            message: "Trashed tasks fetched successfully", 
            task
        });
    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        });
    }
}

// create sub-task      /tasks/:id/sub-task  POST
const createSubTask = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "No task found" 
            })
        }

        if(task.isTrashed){
            return res.status(404).json({
                status: false,
                message: "Trashed Task" 
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);

        if(!isAdmin){
            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        const { title, tag, lastDate } = req.body;

        const newTask = {
            title,
            tag,
            lastDate,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        task.subTasks.push(newTask);

        await task.save();

        res.status(200).json({
            status: true,
            message: "Sub-task added succesfully",
            newSubTasks: task.subTasks
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// Mark Task as Completed   /tasks/:id/sub-task/:subTaskId   PUT
const markSubtaskCompleted = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;
        const subTaskId = req.params.subTaskId;
        const { newStatus } = req.body;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "No task found" 
            })
        }

        if(task.isTrashed){
            return res.status(404).json({
                status: false,
                message: "Task is in trash" 
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);

        if(!isAdmin){
            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        const index = task.subTasks.findIndex((subTask) => subTask._id.equals(subTaskId));

        if(index !== -1){
            if(newStatus === "completed"){
                task.subTasks[index].isCompleted = true;
            }
            else{
                task.subTasks[index].isCompleted =  false;
            }
            
            await task.save();

            return res.status(200).json({
                status: true,
                message: "Subtask status updated successfully" 
            })
        }

        return res.status(403).json({
            status: false,
            message: "Subtask not found" 
        })


    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// Delete sub-task      /tasks/:id/sub-task/:subTaskId   DELETE
const deleteSubTask = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;
        const subTaskId = req.params.subTaskId;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "No task found" 
            })
        }

        if(task.isTrashed){
            return res.status(404).json({
                status: false,
                message: "Task is in trash" 
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);
        if(!isAdmin){
            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        const updatedSubTasks = task.subTasks.filter((subTask) => !subTask._id.equals(subTaskId));
        if (updatedSubTasks.length === task.subTasks.length) {
            return res.status(404).json({
                status: false,
                message: "Sub-task not found"
            });
        }

        task.subTasks = updatedSubTasks;

        await task.save();

        res.status(200).json({
            status: true,
            message: "Sub-task deleted succesfully",
            updatedSubTasks
        })
        
    }catch(error){
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// move task to trash   /tasks/:id/  DELETE
const moveTaskToTrash = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;

        const result = await Task.updateOne(
            {
                _id: taskId,
                taskAdmin: userId,
                isTrashed: false
            },
            {
                $set: { isTrashed: true }
            }
        )

        if(result.modifiedCount === 0){
            return res.status(404).json({
                status: false,
                message: "user not authorized"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Tasks moved to trash successfully"
        })
    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// get trashed tasks    /tasks/trash  GET
const getTrashedTasks = async function(req, res, next){
    try{
        const userId = req.user._id;

        const tasks = await Task.find({
            isTrashed: true,
            $or: [
                {taskAdmin: userId},
                {team: userId}
            ]
        })
        .populate('taskAdmin', 'firstName lastName email')
        .populate('team', 'firstName lastName email');

        if(!tasks || tasks.length===0){
            return res.status(400).json({
                status: true,
                message: "no tasks found"
            });
        }

        return res.status(200).json({
            status: true,
            tasks
        });

    }catch(error){
        res.status(400).json({
            status: false,
            message: error.message
        });
    }
}

// restore trash task   /tasks/trash/:id   PUT
const restoreTrashedTask = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;

        const result = await Task.updateOne(
            {
                _id: taskId,
                isTrashed: true,
                taskAdmin: userId
            },
            {
                $set: {isTrashed: false}
            }
        )

        if(result.modifiedCount === 0){
            return res.status(404).json({
                status: false,
                message: "user is not authorized"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Task restored successfully"
        })
    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// Permanently delete trashed task    /tasks/trash/:id   DELETE
const deleteTrashedTasks = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;

        if(req.user.email === "test.app@flowmate.com"){
            return res.status(404).json({
                status: false,
                message: "Test User is not authorized to delete"
            })
        }

        const task = await Task.findOne({
            _id: taskId,
            isTrashed: true,
            taskAdmin: userId
        });

        if (!task) {
            return res.status(404).json({
                status: false,
                message: "Task not found or user not authorized to delete"
            });
        }

        const result = await Task.deleteOne({ _id: taskId })

        if(result.deletedCount === 0){
            return res.status(404).json({
                status: false,
                message: "User is not authorized"
            })
        }

        await User.updateOne(
            { _id: task.taskAdmin },
            { $pull: { tasks: taskId } }
        );

        await User.updateMany(
            { _id: { $in: task.team } },
            { $pull: { assignedTasks: taskId } }
        );

        res.status(200).json({
            status: true,
            message: "Task deleted successfully"
        })
    }catch(error){
        res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// update task   /tasks/:id/  PUT
const updateTask = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;
        const { title, lastDate, description, status, priority, team } = req.body;

        console.log("taskId : ", taskId);

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "Task does not exist"
            })
        }

        if(!task.taskAdmin.equals(userId)){
            return res.status(404).json({
                status: false,
                message: "User is not authorized"
            })
        }

        if(task.isTrashed){
            return res.status(404).json({
                status: false,
                message: "Invalid action"
            })
        }

        console.log("reached level 1");

        task.title = title;
        task.description = description;
        task.lastDate = lastDate;
        task.priority = priority;
        task.status = status;
        task.team = team;

        console.log("reached level 2");

        await task.save();

        const populatedTask = await Task.findById(taskId)
            .populate('taskAdmin', 'firstName lastName email')
            .populate({
                path: 'team.memberId',
                select: 'firstName lastName'
            });

        return res.status(200).json({
            status: true,
            message: "Task updated successfully",
            task: populatedTask
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// edit task status  /tasks/editStatus/:id/  PUT
const editTaskStatus = async function(req, res, next){
    try{
        const userId = req.user._id;
        const taskId = req.params.id;
        const { newStatus } = req.body;

        const task = await Task.findById(taskId);

        if(!task){
            return res.status(404).json({
                status: false,
                message: "Task does not exist"
            })
        }

        if(task.isTrashed){
            return res.status(404).json({
                status: false,
                message: "Invalid action"
            })
        }

        const isAdmin = task.taskAdmin.equals(userId);
        const isMember = task.team.some((member) => member.memberId.equals(userId));

        if(!isAdmin && !isMember){
            return res.status(403).json({
                status: false,
                message: "User is not authorized"
            })
        }

        if(task.status !== "inqueue"){
            if(!isAdmin){
                return res.status(403).json({
                    status: false,
                    message: "User is not authorized"
                })
            }
        }

        task.status = newStatus;

        await task.save();

        return res.status(200).json({
            status: true,
            message: "Task status updated successfully"
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = { createNewTask, createActivity, uploadAsset, deleteAsset, startTask, markCompleted, createSubTask, deleteSubTask, getAllTasks, getTask, updateTask, moveTaskToTrash, getTrashedTasks, restoreTrashedTask, deleteTrashedTasks, editTaskStatus, markSubtaskCompleted }