import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MdAdd, MdOutlineEdit, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiTwotoneFolderOpen } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch } from 'react-redux';
import { moveToTrash, permanentDeleteTask, restoreFromTrash } from '../../utils/tasksSlice';
import { openForm, closeForm } from '../../utils/tasksFormsSlice';
import { Link, useParams } from 'react-router-dom';
import { startLoading, stopLoading } from '../../utils/loaderSlice';
import { useCallback } from 'react';
import { setToastVisible } from '../../utils/toastNotifiactionSlice';
import { handleTokenExpiration } from '../../utils/loginUserSlice';
import LogRocket from 'logrocket';


const TaskDialog = React.memo(({task, isUserTaskAdmin}) => {
    const dispatch = useDispatch();
    const { filter } = useParams();

    const handleMoveToTrash = useCallback(async (taskId) => {
        try{
            dispatch(startLoading({type:"Move to Trash", message:"Moving task to trash"}));

            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${taskId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();

            if(data?.status){
                dispatch(moveToTrash(taskId));
                dispatch(setToastVisible({message: "Task moved to trash", type:"delete"}));
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }

        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in move task to trash", error) : console.error("Error in move task to trash", error);
        }
        finally{
            dispatch(stopLoading());
        }
    },[dispatch])

    const handleRestoreTaskFromTrash = useCallback(async (taskId) => {
        try{
            dispatch(startLoading({type:"Restore from Trash", message:"Restoring task from trash"}))

            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/trash/${taskId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await res.json();

            if(data?.status){
                dispatch(restoreFromTrash(taskId));
                dispatch(setToastVisible({message: "Task restored successfully", type:"undo"}));
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in restoring task from trash : ", error) : console.error("Error in restoring task from trash : ", error);
        }
        finally{
            dispatch(stopLoading());
        }
    }, [dispatch])

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
                dispatch(setToastVisible({message: "Task deleted successfully", type:"delete"}));
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in deleting task permanently from trash : ", error) : console.error("Error in deleting task permanently from trash : ", error);
        }
        finally{
            dispatch(stopLoading());
        }
    }, [dispatch])

    return(
        <Menu>
            <MenuButton>
                <BsThreeDots className="text-xl"/>
            </MenuButton>
            <MenuItems anchor="bottom" className="bg-white px-6 py-2 shadow-md">
                {
                    filter !== "trashed" && <MenuItem className="my-4">
                        <Link to={`/dashboard/task-info/${task._id}`} className="flex flex-row justify-start items-center text-sm text-gray-800" ><AiTwotoneFolderOpen className='mr-2 h-4 w-4' aria-hidden='true' /> <span>Open Task</span></Link>
                    </MenuItem>
                }

                {
                    (filter !== "trashed" && isUserTaskAdmin) && <MenuItem className="my-4">
                        <button className="flex flex-row justify-start items-center text-sm text-gray-800" onClick={() => {dispatch(openForm({actionType: 'edit', isSubTask: false, data: task}))}}><MdOutlineEdit className='mr-2 h-4 w-4' aria-hidden='true' /> <span>Edit Task</span></button>
                    </MenuItem>
                }

                {
                    (filter !== "trashed" && isUserTaskAdmin) && <MenuItem className="my-4">
                        <button className="flex flex-row justify-start items-center text-sm text-gray-800" onClick={() => {dispatch(openForm({actionType: 'add', isSubTask: true, data: task._id}))}}><MdAdd className='mr-2 h-4 w-4' aria-hidden='true'/> <span>Add Sub-Task</span></button>
                    </MenuItem>
                }

                {
                    (filter !== "trashed" && isUserTaskAdmin) ? <MenuItem className="my-4">
                        <button onClick={() => handleMoveToTrash(task?._id)} className="flex flex-row justify-start items-center text-red-600 text-sm"><RiDeleteBin6Line className='mr-2 h-4 w-4' aria-hidden='true' /> <span>Move to Trash</span></button> 
                    </MenuItem> : isUserTaskAdmin && <MenuItem className="my-4">
                        <button onClick={() => handleRestoreTaskFromTrash(task?._id)} className="flex flex-row justify-start items-center text-red-600 text-sm"><MdOutlineSettingsBackupRestore className='mr-2 h-4 w-4' aria-hidden='true' /> <span>Restore</span></button>
                    </MenuItem>
                }

                {
                    (filter === "trashed" && isUserTaskAdmin) && <MenuItem className="my-4">
                        <button onClick={() => deleteTaskPermanently(task?._id)} className="flex flex-row justify-start items-center text-red-600 text-sm"><RiDeleteBin6Line className='mr-2 h-4 w-4' aria-hidden='true'/> <span>Delete</span></button>
                    </MenuItem>
                }
            </MenuItems>
        </Menu>
    )
})

export default TaskDialog;