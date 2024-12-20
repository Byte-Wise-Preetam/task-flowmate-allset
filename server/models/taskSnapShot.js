const mongoose = require("mongoose");

const taskSnapshotSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    originalTasks: [{
      type: Object,
      required: true
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
});

taskSnapshotSchema.index({ userId: 1 });
taskSnapshotSchema.index({ createdAt: 1 });

const TaskSnapshot = mongoose.model('TaskSnapshot', taskSnapshotSchema);
module.exports = TaskSnapshot;