import { PRIOTITYSTYELS, BGS, STATUSSTYLES, formatDate, dateFormatter } from "../utils/index";
import { BiMessageAltDetail } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaListCheck } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import TaskDialog from "./tasks/TaskDialog";
import { useDispatch } from "react-redux";
import { openForm } from "../utils/tasksFormsSlice";
import { Link, useParams } from "react-router-dom";
import {
    MdAttachFile,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import UserInfo from "./UserInfo";

const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
};

const TaskCard = ({task, isUserTaskAdmin}) => {

    if (!task) {
        return <div>No Task Available</div>;
    }

    const dispatch = useDispatch();
    const { filter } = useParams();

    const { title, description, priority, status, activities, assets, team, subTasks, isTrashed } = task;

    const completedSubTasks = subTasks.filter((subTask) => subTask.isCompleted).length;
    const totalSubTasks = subTasks.length;

    return(
        <div className="max-w-[375px] mx-auto p-4 shadow-md bg-white rounded-md overflow-hidden">
            <div className="flex flex-row justify-between items-center">
                <div className={`flex flex-row items-center text-sm ${PRIOTITYSTYELS[priority]}`}>
                    <span className={`mr-1`}>{ICONS[priority]}</span>
                    <span className="uppercase">{priority} Priority</span>
                </div>
                <TaskDialog task = {task} isUserTaskAdmin={isUserTaskAdmin}/>
            </div>

            {!isTrashed ? (
                <Link to={`/dashboard/task-info/${task._id}`} className="">
                    <div className="flex flex-row justify-start items-center my-1">
                    <div className={`min-w-4 h-4 rounded-full mr-2 ${STATUSSTYLES[status]}`}></div>
                    <div className="text-black text-lg font-medium line-clamp-1">{title}</div>
                    </div>
                </Link>
                ) : (
                <div className="flex flex-row justify-start items-center my-1">
                    <div className={`min-w-4 h-4 rounded-full mr-2 ${STATUSSTYLES[status]}`}></div>
                    <div className="text-black text-lg font-medium line-clamp-1">{title}</div>
                </div>
            )}

            <div className="text-gray-600 text-sm text-left">
                <span>{formatDate(new Date(task.createdAt))}</span>
                {
                    isUserTaskAdmin && <span className="ml-2 px-2 py-0.5 text-center text-[10px] rounded-full bg-violet-100 text-violet-700 font-bold">Admin</span>
                }
            </div>

            <div className="w-full border-t border-gray-200 my-2"></div>

            <div className="w-full h-8 flex flex-row justify-between items-center">
                <div className="flex flex-row text-sm">
                    <div className="flex flex-row items-center text-base mr-2 text-gray-600">
                        <BiMessageAltDetail className="mr-0.5"/>
                        <span className="">{activities.length}</span>
                    </div>
                    <div className="flex flex-row items-center text-base text-gray-600">
                        <MdAttachFile className="mr-0.5"/>
                        <span className="">{assets.length}</span>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center">
                    {
                        team.map((member, index) => (
                            <UserInfo user={member} key={member._id} index={index}/>
                        ))
                    }
                </div>

            </div>

            <div className="w-full border-t border-gray-200 my-2"></div>

            <div className="line-clamp-1 text-md text-left mt-3 lg:mt-4 mb-3 lg:mb-6 text-gray-600">{description}</div>

            <div className="p-2 border-2 border-gray-100 rounded-md my-2 lg:my-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center text-gray-800">
                        <FaListCheck className="mr-2 font-medium"/>
                        <span className="font-normal">SubTask</span>
                    </div>
                    <div className="text-gray-800">{completedSubTasks}/{totalSubTasks}</div>
                </div>
                <div className="w-9/10 bg-gray-200 rounded-md mt-4 mb-1 overflow-hidden">
                    <div className="h-1.5 bg-gray-400" style={{ width: `${(completedSubTasks / totalSubTasks) * 100}%` }}></div>
                </div>
            </div>

            <div className="py-2">
                <button className={`w-full flex flex-row items-center text-left font-semibold uppercase text-gray-800 ${filter==="trashed" || !isUserTaskAdmin ? "cursor-not-allowed disabled opacity-50" : "cursor-pointer"}`} onClick={() => {(filter!=="trashed" && isUserTaskAdmin) && dispatch(openForm({actionType: 'add', isSubTask: true, data: task._id}))}}>
                    <IoMdAdd className="mr-1"/>
                    <span className="font-normal">Add Subtask</span>
                </button>
            </div>
        </div>
    )
}

export default TaskCard;