import { useCallback, useEffect, useState } from "react";
import { MdGridView } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { FaList } from "react-icons/fa";
import BoardView from "./BoardView";
import ListView from "./ListView";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AddTask from "./tasks/AddTask";
import AddsubTask from "./tasks/AddsubTask";
import { openForm, closeForm } from "../utils/tasksFormsSlice";

const TasksLayout = () => {

    const tasks = useSelector(state => state.tasks.value);

    const taskForms = useSelector(state => state.taskForms);
    const dispatch = useDispatch();

    let { filter } = useParams();

    const [selectedView, setSelectedView] = useState("board");

    const [availableTasks, setAvailableTasks] = useState(tasks);

    const filterTasks = useCallback((query = "") => {
        if(query !== ""){
            if(query === "trashed"){
                return tasks.filter((task) => task.isTrashed === true);
            }else{
                return tasks.filter((task) => task.isTrashed === false && task.status.toLowerCase() === query);
            }
        }
        else{
            return tasks.filter((task) => task.isTrashed === false);
        }
    }, [tasks]);

    const handleSelectedView = useCallback(() => {
        setSelectedView((prev) => prev === "board" ? "list" : "board")
    }, [])

    useEffect(() => {
        const filteredTasks = filterTasks(filter);
        setAvailableTasks(filteredTasks);
    }, [filter, tasks, filterTasks])

    return (
        <div className="w-full px-4 sm:px-3 lg:px-8 overflow-y-auto" style={{ maxHeight: "calc(100vh - 70px)"}}>
            <div className="max-w-[1200px] flex flex-row justify-between items-center mt-6 mx-auto">
                <div className="text-2xl sm:text-3xl font-semibold capitalize">{filter} Tasks</div>
                {
                    !filter && <button onClick={() => {dispatch(openForm({actionType: 'add', isSubTask: false}))}} className="flex flex-row items-center justify-center bg-blue-600 text-base sm:text-lg text-white font-medium px-2 py-1.5 sm:px-3 sm:py-2 rounded-sm sm:rounded-md">
                        <IoMdAdd className="w-5 h-5 sm:w-6 sm:h-6 mr-1"/> 
                        <span>Create Task</span>
                    </button>
                }
            </div>

            <div className="flex flex-row max-w-[1200px] mx-auto my-4 mt-6 sm:mt-2">
                <button onClick={handleSelectedView} className={`mr-5 sm:mr-8 flex flex-row items-center text-base sm:text-base font-medium bg-white px-3 py-2 sm:px-4 sm:py-3 ${selectedView === "board" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-800"}`}>
                    <MdGridView className="w-4 h-4 mr-1 sm:mr-2"/>
                    <span>Board View</span>
                </button>

                <button onClick={handleSelectedView} className={`flex flex-row items-center text-base sm:text-base font-medium bg-white px-3 py-2 sm:px-4 sm:py-3 ${selectedView === "list" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"}`}>
                    <FaList className="w-4 h-4 sm:w-4 sm:h-4 mr-2"/>
                    <span>List View</span>
                </button>
            </div>

            <div className="max-w-[1200px] mx-auto my-6 sm:my-8 sm:mt-5">
                {
                    selectedView === "board" ? <BoardView tasks={availableTasks}/> : <ListView tasks={availableTasks}/>
                }
            </div>

            {
                taskForms.isOpen && ( taskForms.isSubTask ? <AddsubTask/> : <AddTask/> )
            }
        </div>
    )
}

export default TasksLayout;