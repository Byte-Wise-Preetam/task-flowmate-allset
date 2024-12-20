const User = require("../models/user");
const Task = require("../models/task");
const TaskSnapshot = require("../models/taskSnapShot")

const TEST_ACCOUNT_EMAIL = 'monkey.ginger@gmail.com';
const RESET_INTERVAL = 1 * 60 * 1000;

async function initializeTestAccount() {
    try {
      const testUser = await User.findOne({ email: TEST_ACCOUNT_EMAIL });
      
      if (!testUser) {
        console.error('Test account not found');
        return;
      }
  
      // Get all tasks for test account
      const tasks = await Task.find({ userId: testUser._id });
      
      // Create or update snapshot
      await TaskSnapshot.findOneAndUpdate(
        { userId: testUser._id },
        { 
          userId: testUser._id,
          originalTasks: tasks,
          createdAt: new Date()
        },
        { upsert: true, new: true }
      );
  
      console.log('Test account snapshot created successfully');
    } catch (error) {
      console.error('Error initializing test account:', error);
    }
}

async function checkAndResetTestData(req, res, next) {
    try {
      // Only proceed if user is logged in and is test account
      if (!req.user || req.user.email !== TEST_ACCOUNT_EMAIL) {
        return next();
      }
  
      const snapshot = await TaskSnapshot.findOne({ userId: req.user._id });
      if (!snapshot) {
        return next();
      }
  
      // Check if 30 minutes have passed since last reset
      const timeSinceReset = Date.now() - snapshot.createdAt.getTime();
      
      if (timeSinceReset >= RESET_INTERVAL) {
        // Delete all current tasks
        await Task.deleteMany({ userId: req.user._id });
        
        // Restore original tasks
        const tasksToInsert = snapshot.originalTasks.map(task => ({
          ...task,
          _id: new mongoose.Types.ObjectId(), // Generate new IDs
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        
        await Task.insertMany(tasksToInsert);
        
        // Update snapshot timestamp
        snapshot.createdAt = new Date();
        await snapshot.save();
        
        console.log('Test account data reset successfully');
      }
      
      next();
    } catch (error) {
      console.error('Error in test account middleware:', error);
      next(error);
    }
}
  
module.exports = {
    initializeTestAccount,
    checkAndResetTestData
};
