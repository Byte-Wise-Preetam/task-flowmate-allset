import { STATUSSTYLES } from "../utils";
import { BiMessageAltDetail } from "react-icons/bi";
import {
    MdAttachFile,
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import UserInfo from "./UserInfo";
import { PRIOTITYSTYELS } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import { openForm } from "../utils/tasksFormsSlice";
import { moveToTrash, restoreFromTrash } from "../utils/tasksSlice";
import { useParams, Link } from "react-router-dom";
import { useCallback, memo } from "react";
import { startLoading, stopLoading } from "../utils/loaderSlice";
import { handleTokenExpiration } from "../utils/loginUserSlice";
import { setToastVisible } from "../utils/toastNotifiactionSlice";
import LogRocket from "logrocket";

const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
};

const ListView = ({ tasks }) => {
    // Early state checks to prevent hook inconsistencies
    if (!tasks) {
        return <div>Loading...</div>;
    }

    if (tasks.length === 0) {
        return <div>No Tasks Available</div>;
    }

    const loggedinUser = useSelector((state) => state.loginUser.user);
    const dispatch = useDispatch();
    const { filter } = useParams();

    const handleMoveToTrash = useCallback(async (taskId) => {
        try {
            dispatch(startLoading({type:"Move to Trash", message:"Moving task to trash"}));

            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${taskId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();

            if (data?.status) {
                dispatch(moveToTrash(taskId));
                dispatch(setToastVisible({message: "Task moved to trash", type:"delete"}));
            }else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
        } catch (error) {
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in moving task to trash : ", error) : console.error("Error in moving task to trash : ", error);
        } finally {
            dispatch(stopLoading());
        }
    }, [dispatch]);

    const handleRestoreTaskFromTrash = useCallback(async (taskId) => {
        try {
            dispatch(startLoading({type:"Restore from Trash", message:"Restoring task from trash"}));

            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/trash/${taskId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();

            if (data?.status) {
                dispatch(restoreFromTrash(taskId));
                dispatch(setToastVisible({message: "Task restored successfully", type:"undo"}));
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
        } catch (error) {
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in restoring task from trash : ", error) : console.error("Error in restoring task from trash : ", error);
        } finally {
            dispatch(stopLoading());
        }
    }, [dispatch]);

    const deleteTaskPermanently = useCallback(async (taskId) => {
        try{
            dispatch(startLoading({type:"Restore from Trash", message:"Restoring task from trash"}))

            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/trash/${taskId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();

            if(data?.status){
                dispatch(permanentDeleteTask(taskId));
                dispatch(setToastVisible({message: `Task deleted successfully`, type:"delete"}));
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in deleting task from trash : ", error) : console.error("Error in deleting task from trash : ", error);
        }
        finally{
            dispatch(stopLoading());
        }
    }, [dispatch])

    // Memoized row component to prevent unnecessary re-renders
    const TableRow = memo(({ task, isUserTaskAdmin }) => {
        if (!task) {
            return (
                <tr>
                    <td colSpan="6">Loading...</td>
                </tr>
            );
        }

        const { 
            title, 
            status, 
            priority, 
            activities, 
            subTasks, 
            assets, 
            team,
            _id,
            taskAdmin
        } = task;

        return (
            <tr className="text-gray-600 border-b border-gray-300 last:border-0">
                <td className="min-w-[225px] w-[25%] py-4 pl-4">
                    <div className="flex flex-row justify-start items-center">
                        <Link to={`http://localhost:5173/dashboard/task-info/${_id}`} className="w-full flex flex-row justify-start items-center">
                            <div className={`min-w-4 min-h-4 rounded-[50%] mr-2 ${STATUSSTYLES[status]}`}></div>
                            <div className="text-black text-sm sm:text-base font-medium line-clamp-1">{title}</div>
                        </Link>
                    </div>
                </td>

                <td className="min-w-[160px] w-[20%] py-4">
                    <div className={`flex flex-row justify-center font-medium text-[12px] sm:text-sm items-center ${PRIOTITYSTYELS[priority]}`}>
                        <span className={`mr-1`}>{ICONS[priority]}</span>
                        <span className="uppercase">{priority} Priority</span>
                    </div>
                </td>

                <td className="min-w-[150px] w-[12%] py-4">
                    <div className="text-center text-sm sm:text-base">10-Nov-2024</div>
                </td>

                <td className="min-w-[150px] w-[15%] py-4">
                    <div className="flex flex-row justify-center items-center">
                        <div className="flex flex-row items-center mr-4 text-gray-600">
                            <BiMessageAltDetail className="w-4 h-4 mr-0.5"/>
                            <span className="text-sm sm:taxt-base">{activities.length}</span>
                        </div>
                        <div className="flex flex-row items-center mr-4 text-gray-600">
                            <MdAttachFile className="mr-0.5"/>
                            <span className="text-sm sm:taxt-base">{assets.length}</span>
                        </div>
                        <div className="flex flex-row items-center text-gray-600">
                            <FaListCheck className="mr-0.5"/>
                            <span className="text-sm sm:taxt-base">{subTasks.length}</span>
                        </div>
                    </div>
                </td>

                <td className="min-w-[150px] w-[15%] py-4">
                    <div className="flex flex-row justify-center items-center">
                        {team.map((member, index) => (
                            <UserInfo user={member} key={member._id} index={index}/>
                        ))}
                    </div>
                </td>

                {isUserTaskAdmin && (
                    <td className="tasks-list__edit-delete min-w-[135px] w-[13%] py-4">
                            {filter === "trashed" ? (
                                <div className="text-sm flex flex-row justify-center items-center">
                                    <button 
                                        className="text-blue-600 mr-4" 
                                        onClick={() => handleRestoreTaskFromTrash(_id)}
                                    >
                                        Restore
                                    </button>
                                    <button 
                                        className="text-red-700" 
                                        onClick={() => deleteTaskPermanently(_id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ) : (
                                <div className="text-sm flex flex-row justify-center items-center">
                                    <button 
                                        className="text-blue-600 mr-4" 
                                        onClick={() => dispatch(openForm({actionType: 'edit', isSubTask: false, data: task}))}
                                    >
                                        Edit
                                    </button>
                                    <button className="text-red-700" onClick={() => handleMoveToTrash(_id)}>
                                        Move to trash
                                    </button>
                                </div>
                            )}
                            
                            {/* <button 
                                className="text-red-700" 
                                onClick={() => handleMoveToTrash(_id)}
                            >
                                Delete
                            </button> */}
                    </td>
                )}
            </tr>
        );
    }, (prevProps, nextProps) => {
        // Custom comparison to prevent unnecessary re-renders
        return (
            prevProps.task._id === nextProps.task._id && 
            prevProps.isUserTaskAdmin === nextProps.isUserTaskAdmin
        );
    });

    return (
        <div style={{fontFamily: "var(--nunito)"}} className="mt-4 mx-auto rounded-lg shadow-lg bg-white w-full overflow-x-auto flex flex-row ">
            <div className="px-4 sm:px-6 xl:py-2 max-w-[1200px] mx-auto">
                <table className="bg-white tasks-list">
                    <thead className='w-full border-b border-gray-500'>
                        <tr className='w-full text-black text-base sm:text-lg text-center'>
                            <th className='py-3 sm:py-4 line-clamp-1'>Task Title</th>
                            <th className='py-3 sm:py-4'>Priority</th>
                            <th className='py-3 sm:py-4 line-clamp-1'>Created At</th>
                            <th className='py-3 sm:py-4'>Assets</th>
                            <th className='py-3 sm:py-4'>Team</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map((task) => (
                            <TableRow 
                                key={task._id} 
                                task={task} 
                                isUserTaskAdmin={loggedinUser._id === task.taskAdmin._id}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListView;