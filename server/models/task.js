const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        enum: ["started", "assigned", "in progress", "bug", "completed", "commented"]
    },
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

const assetSchema = new mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    filename: {
        type: String,
        required: true
    },
    asset_id: {
        type: String,
        required: true
    },
    public_id: {
        type: String,
        required: true
    },
    url : {
        type: String,
        required: true
    },
    format : {
        type: String,
    },
    resource_type: {
        type: String,
        required: true
    },
    bytes: {
        type: Number,
        required: true
    },
    created_at: {
        type: String,
        required: true
    },
    width:{
        type: Number
    },
    height: {
        type: Number
    }
}, {timestamps: true});

const subTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    lastDate: {
        type: Date,
        default: null
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); 

const teamMemberSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "inqueue",
        enum: ["inqueue","active","completed"]
    },
    priority: {
        type: String,
        required: true,
        enum: ["low", "medium", "high"]
    },
    taskAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"  
    },
    lastDate: {
        type: Date,
        default: null,
        required: true
    },
    team: [teamMemberSchema],
    subTasks: [subTaskSchema],
    activities: [activitySchema],  
    assets: [assetSchema],
    isTrashed: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

const Task = mongoose.model("Task", taskSchema);
module.exports =Task;