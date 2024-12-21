import { RxActivityLog } from "react-icons/rx";
import { FaList, FaPlay, FaTrashAlt, FaUndoAlt } from "react-icons/fa";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { dateFormatter } from "../../utils";
import { MdDownloadDone, MdFileDownloadDone, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp, MdOutlineDoneAll, MdOutlineFileDownload, MdOutlineMessage, MdOutlinePending, MdTaskAlt } from "react-icons/md";
import { FaBug, FaThumbsUp, FaUser } from "react-icons/fa6";
import { GrInProgress } from "react-icons/gr";
import { STATUSSTYLES, PRIORITYBGSTYLES, PRIOTITYSTYELS } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { addActivity, editSubTaskStatus, editTaskStatus, getTask } from "../../utils/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteSubtask, uploadAsset } from "../../utils/tasksSlice";
import { useDropzone } from 'react-dropzone';
import { ImCancelCircle } from "react-icons/im";
import { HiCursorClick } from "react-icons/hi";
import { startLoading, stopLoading } from "../../utils/loaderSlice";
import { setToastVisible } from "../../utils/toastNotifiactionSlice";
import { handleTokenExpiration } from "../../utils/loginUserSlice";
import LogRocket from "logrocket";

const activities = ["Completed", "Started", "Bug", "In Progress", "Commented", "Assigned"];

const TAGTYPEICON = {
    commented: (
      <div className='w-12 h-12 bg-gray-500 text-white rounded-[50%] flex flex-row justify-center items-center mr-4'>
        <MdOutlineMessage />
      </div>
    ),
    started: (
      <div className='w-12 h-12 bg-violet-600 text-white rounded-[50%] flex flex-row justify-center items-center mr-4'>
        <FaThumbsUp size={20} />
      </div>
    ),
    assigned: (
      <div className='w-12 h-12 bg-gray-500 text-white rounded-[50%] flex flex-row justify-center items-center mr-4'>
        <FaUser size={14} />
      </div>
    ),
    bug: (
      <div className='w-12 h-12 bg-red-600 text-white rounded-[50%] flex flex-row justify-center items-center mr-4'>
        <FaBug size={24} />
      </div>
    ),
    completed: (
      <div className='w-12 h-12 bg-green-600 text-white rounded-[50%] flex flex-row justify-center items-center mr-4'>
        <MdOutlineDoneAll size={24} />
      </div>
    ),
    "in progress": (
      <div className="w-12 h-12 bg-violet-600 text-white rounded-[50%] flex flex-row justify-center items-center mr-4">
        <GrInProgress size={16} />
      </div>
    ),
}

const PRIORITYICONS = {
    high: <MdKeyboardDoubleArrowUp className="w-4 h-4"/>,
    medium: <MdKeyboardArrowUp className="w-4 h-4"/>,
    low: <MdKeyboardArrowDown className="w-4 h-4"/>,
}

const TaskInfo = () => {
    const dispatch = useDispatch();
    const { taskId } = useParams();
    const navigate = useNavigate();

    const [droppedFile, setDroppedFile] = useState();

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: useCallback((files) => {
            setDroppedFile(files[0]);
        }, [])
    });

    const tasks = useSelector(state => state.tasks.value);
    const loggedinUser = useSelector((state) => state.loginUser.user);

    // const task = useMemo(() => tasks.find((task) => task._id === taskId), [tasks, taskId]);

    const taskIndex = useMemo(() => tasks.findIndex((task) => task._id === taskId), [tasks, taskId]);

    const task = tasks[taskIndex];

    const isUserTaskAdmin = useMemo(() => loggedinUser?._id === task?.taskAdmin._id, [loggedinUser, task]);

    const [selected, setSelected] = useState(0);

    const { register, handleSubmit, reset, setValue } = useForm();

    const handleRemoveDroppedFile = useCallback(() => {
        setDroppedFile("");
    }, [])

    const handleEditStatus = useCallback(async (newStatus) => {
        try{
            dispatch(startLoading({type:"Task Status", message: "Change Task Status"}));

            const updatedStatus = {
                newStatus
            }
            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/editStatus/${taskId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedStatus)
            });
            const data = await res.json();
            if(data.status){
                dispatch(editTaskStatus({taskId, newStatus}));
                newStatus === "active" && dispatch(setToastVisible({message: "Task status changed to active", type:"undo"}));
                newStatus === "completed" && dispatch(setToastVisible({message: "Great job! Task completed.", type:"success"}));
                
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in editing task status :", error) : console.error("Error in editing task status :", error);
        }
        finally{
            dispatch(stopLoading());
        }
        
    }, [dispatch, taskId])

    const handleUpdateSubtaskStatus = useCallback(async (subTaskId, newStatus) => {
        try{
            dispatch(startLoading({type:"Subtask Status", message: "Change Subtask Status"}))

            const updatedStatus = {
                newStatus
            }
            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${taskId}/sub-task/${subTaskId}`,{
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedStatus)
            });
            const data = await res.json();

            if(data.status)
            {
                dispatch(editSubTaskStatus({taskId, subTaskId, newStatus}));
                newStatus === "completed" && dispatch(setToastVisible({message: "Well done! Subtask completed.", type:"success"}));
                newStatus === "undo" && dispatch(setToastVisible({message: "Subtask marked as incomplete.", type:"undo"}))
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
        }catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in Updating Subtask status", error) : console.error("Error Updating Subtask status:", error);
        }
        finally{
            dispatch(stopLoading());
        }
    }, [dispatch, taskId])

    const handleUploadImages = useCallback(async () => {
        const data = new FormData();
        data.append("file", droppedFile);
        data.append("upload_preset", import.meta.env.VITE_APP_CLOUDINARY_UPLOAD_PRESET);
        data.append("cloud_name", import.meta.env.VITE_APP_CLOUDINARY_CLOUD_NAME);

        try{
            dispatch(startLoading({type:"Upload Assets on Cloudinary", message: "Uploading assets..."}));

            const cloudinaryRes = await fetch(import.meta.env.VITE_APP_CLOUDINARY_URL, {
                method: "POST",
                body: data
            })

            if(cloudinaryRes.ok){
                const cloudinaryData = await cloudinaryRes.json();

                const { display_name, asset_id, public_id, url, format, resource_type, bytes, created_at, width, height } = cloudinaryData;

                const newAsset = { display_name, asset_id, public_id, url, format, resource_type, bytes, created_at, width, height };

                const serverRes = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${taskId}/asset`,{
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newAsset)
                });
                const serverData = await serverRes.json();

                if(serverData.status){
                    const { updatedAssets } = serverData;
                    dispatch(uploadAsset({taskId: taskId, updatedAssets}));

                    dispatch(setToastVisible({message: "Asset uploaded successfully", type:"add"}));
                }
                else if(serverData?.message === "Token has Expired. Please login again."){
                    dispatch(handleTokenExpiration());
                }

                // Remove the uploaded file from droppedFile
                setDroppedFile(null);
            }

        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in upload Asset:", error) : console.error("Error in upload Asset:", error);
            return;
        }
        finally{
            setDroppedFile(null);
            dispatch(stopLoading());
        }
    }, [dispatch, droppedFile, taskId])

    const handleDeleteAssetFromCloudinary = useCallback(async (publicId, resource_type) => {
        try {
            dispatch(startLoading({type:"Delete Asset from Cloudinary", message: "Deleting Asset..."}));

            const paramater = {
                resource_type: resource_type
            }
            
            const serverRes =await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${taskId}/asset/${publicId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paramater)
            })

            const serverData = await serverRes.json();

            if(serverData.status){
                const { updatedAssets } = serverData;
                dispatch(uploadAsset({taskId: taskId, updatedAssets}));
                dispatch(setToastVisible({message: `Asset deleted successfully`, type:"delete"}));
            }
            else if(serverData?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
            else {
                return null;
            }
        }
        catch (error) {
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in Deleting Asset", error) : console.error("Error in Deleting Asset:", error);
        }
        finally{
            dispatch(stopLoading());
        }
    }, [dispatch, taskId])

    const handleDeleteSubTask = useCallback(async (subTaskId) => {
        try{
            dispatch(startLoading({type:"Delete", message: "Deleting Subtask..."}));

            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${taskId}/sub-task/${subTaskId}`,{
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();

            if(data.status){
                dispatch(deleteSubtask({taskId: taskId, updatedSubTasks: data.updatedSubTasks}));
                dispatch(setToastVisible({message: `Subtask deleted successfully`, type:"delete"}));
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }

        }catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in deleting Subtask", error) : console.error("Error in deleting subtask : ", error);
        }
        finally{
            dispatch(stopLoading());
        }
    }, [dispatch, taskId])

    const handleAddActivity = useCallback(async (formData) => {
        try{
            dispatch(startLoading({type:"Create", message: "Creating activity..."}));

            const newActivity = {
                tag: formData.tag.toLowerCase(),
                title: formData.title
            }

            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${taskId}/activity`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newActivity)
            });
            const data = await res.json();

            if(data.status){
                const {updatedActivities} = data;
                dispatch(addActivity({taskId: taskId, updatedActivities}));

                reset();

                dispatch(setToastVisible({message: "Activity created successfully", type:"add"}));
                
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in creating activity", error) : console.error("Error in Creating Activity", error);
        }
        finally{
            dispatch(stopLoading());
        }
    }, [dispatch])


    if(!task){
        return <div>Loading...</div>
    }

    return(
        <div className="w-full mb-4">
            <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 break-words">
                        {task.title}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 break-words">
                        {task.description}
                    </p>
                </div>
                
                <div className="w-full flex flex-row gap-y-5 sm:gap-y-0 gap-x-8 mx-auto flex-wrap my-4 mb-6">

                    <div className="flex gap-x-6 sm:gap-x-8 gap-y-2 flex-grow sm:flex-grow-0">
                        <button
                            onClick={() => setSelected(0)}
                            className={`flex items-center px-2.5 py-2.5 font-semibold rounded-sm transition-colors bg-white ${
                                selected === 0 
                                ? "text-blue-600 shadow-sm border-b-2 border-blue-600" 
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                            >
                            <FaList className="w-4 h-4 mr-2"/>
                            <span>Task Details</span>
                        </button>

                        <button
                            onClick={() => setSelected(1)}
                            className={`flex items-center px-2.5 py-2.5 font-semibold rounded-sm transition-colors bg-white ${
                                selected === 1 
                                ? "text-blue-600 shadow-sm border-b-2 border-blue-600" 
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                            >
                            <RxActivityLog className="w-4 h-4 mr-2"/>
                            <span>Activities</span>
                        </button>
                    </div>

                    <div className="flex gap-2">
                        {
                            task.status === "inqueue" && (
                                <button 
                                    onClick={() => handleEditStatus("active")} 
                                    className=" bg-blue-600 text-white flex flex-row items-center gap-x-2 text-sm sm:text-base font-bold px-3 py-1.5 rounded-[3px]">
                                        <FaPlay className="w-3 h-3"/> 
                                        <span>Start Task</span>
                                </button>)
                        }

                        {
                            (task.status === "active" && isUserTaskAdmin) && (
                                <button onClick={() => 
                                    handleEditStatus("completed")} 
                                    className=" bg-blue-600 text-white flex flex-row items-center gap-x-1 text-sm sm:text-base font-bold px-2.5 py-2.5 rounded-[3px]">
                                        <MdFileDownloadDone className="w-5 h-5"/> 
                                        <span>Mark as Done</span>
                                </button>)
                        }

                        {
                            (task.status === "completed" && isUserTaskAdmin) && (
                                <button 
                                    onClick={() => handleEditStatus("active")} 
                                    className=" bg-blue-600 text-white flex flex-row items-center gap-x-2 text-sm sm:text-base font-bold px-3 py-2.5 sm:py-1.5 rounded-[3px]">
                                        <FaUndoAlt className="w-4 h-4"/> 
                                        <span>Undo</span>
                                </button>)
                        }
                    </div>
                </div>

                {
                    selected === 0 && <div className="bg-white p-4 sm:flex sm:flex-row gap-x-10">
                        <div className="sm:w-[50%]">
                            <div className="flex flex-row items-center gap-x-8">
                                <div className={`flex flex-row items-center py-2 px-4 rounded-[2rem] font-semibold ${PRIORITYBGSTYLES[task.priority]} ${PRIOTITYSTYELS[task.priority]}`}>
                                    {PRIORITYICONS[task.priority]}
                                    <span className={`ml-1 text-sm uppercase`}>{task.priority} priority</span>
                                </div>

                                <div className="flex flex-row items-center">
                                    <div className={`mr-1 w-4 h-4 rounded-[50%] ${STATUSSTYLES[task.status]}`}></div>
                                    <span className="text-md capitalize">{task.status}</span>
                                </div>
                            </div>

                            <div className="my-4 text-base text-gray-500">Created At: Sun Feb 11 2024</div>

                            <div className="w-full border-t border-gray-200 my-4"></div>

                            <div className="flex flex-row items-center font-medium text-gray-950 ml-4">
                                <div>Assets: {task?.assets.length}</div>
        
                                <div className="border-l-2 border-gray-400 h-4 mx-6"></div>

                                <div>Sub-Task: {task?.subTasks.length}</div>
                            </div>

                            <div className="w-full border-t border-gray-200 my-4"></div>

                            {
                                task?.taskAdmin?._id !== loggedinUser._id && <div>
                                    <div className="text-gray-800 text-base font-semibold mb-2 uppercase">TASK ADMIN</div>
                                    <div className="w-full border-t border-gray-200 my-2"></div>

                                    <div className="flex flex-row items-center bg-gray-50 rounded-lg px-2 py-3 my-4">
                                        <div className="w-10 h-10 rounded-[50%] flex flex-row items-center bg-blue-600 justify-center mr-2 text-white text-lg font-semibold">{task?.taskAdmin?.firstName[0]}{task?.taskAdmin?.lastName[0]}</div>
                                        <div>
                                            <div className="text-gray-900 text-lg font-semibold">{task?.taskAdmin?.firstName} {task?.taskAdmin?.lastName}</div>
                                            <div className="text-gray-600 text-sm font-medium">{task?.taskAdmin?.email}</div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {
                                task?.team.length !== 0 && <div className="my-4">
                                    <div className="text-gray-800 text-base font-semibold mb-2 uppercase">TASK TEAM</div>
                                    <div className="w-full border-t border-gray-200 my-2"></div>
                                    <div>
                                        {
                                            task?.team.map((member, index) => (
                                                <div className="flex flex-row items-center bg-gray-50 rounded-lg px-2 py-3 my-4" key={member.memberId._id}>
                                                    <div className="w-10 h-10 rounded-[50%] flex flex-row items-center bg-blue-600 justify-center mr-2 text-white text-lg font-semibold">{member.memberId.firstName[0]}{member.memberId.lastName[0]}</div>
                                                    <div>
                                                        <div className="text-gray-900 text-lg font-semibold">{member.memberId.firstName} {member.memberId.lastName}</div>
                                                        <div className="text-gray-600 text-sm font-medium">{member.role}</div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }

                            {
                                task?.subTasks.length !== 0 && <div>
                                    <div className="text-gray-800 text-base font-semibold mb-2">SUB-TASKS</div>
                                    <div className="w-full border-t border-gray-200 my-2"></div>
                                    <div>
                                        {
                                            task?.subTasks.map((subTask, index) => (
                                                <div className="flex flex-col gap-y-2 xl:gap-y-0 xl:flex-row justify-between items-start py-3 px-2 my-4 bg-gray-50 rounded-lg" key={subTask._id}>
                                                    <div className="flex flex-row items-center">

                                                        <MdTaskAlt className="w-7 h-7 text-violet-600 mr-3"/>
                                                        
                                                        <div>
                                                            <div className="text-gray-600 text-sm font-medium flex flex-row items-center justify-between">
                                                                <span className="text-[11px] sm:text-sm">Last Date : {dateFormatter(subTask.lastDate)}</span>
                                                                <span className="ml-4 px-2 py-0.5 text-center max-w-[100px] inline-block line-clamp-1 text-sm rounded-full bg-violet-100 text-violet-700 font-semibold">{subTask.tag}</span>
                                                            </div>
                                                            <div className="text-gray-900 text-base font-semibold mt-1">{subTask.title}</div>
                                                        </div>
                                                    </div>

                                                    <div className="w-full xl:w-[initial] flex flex-row justify-between xl:justify-end items-center gap-x-4 xl:gap-x-2">
                                                        {
                                                            isUserTaskAdmin && (
                                                                !subTask.isCompleted ? 
                                                            
                                                                <button onClick={() => handleUpdateSubtaskStatus(subTask._id, "completed")} className="flex flex-row items-center text-sm px-2 py-0.5 rounded-[16px] gap-x-1 bg-violet-100 text-blue-700">
                                                                <MdFileDownloadDone className="w-4 h-4"/> <span>Mark as Done</span>
                                                                </button> : 
                                                                
                                                                <button onClick={() => handleUpdateSubtaskStatus(subTask._id, "undo")} className="flex flex-row items-center text-sm px-2 py-0.5 rounded-[16px] gap-x-1 bg-violet-100 text-blue-700">
                                                                <FaUndoAlt className="w-3 h-3"/> <span>Undo</span>
                                                                </button>
                                                            )
                                                        }

                                                        {
                                                            isUserTaskAdmin &&
                                                            <button onClick={() => handleDeleteSubTask(subTask._id)}>
                                                                <FaTrashAlt className="text-gray-500"/>
                                                            </button>
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="mt-8 sm:mt-0 sm:w-[50%]">
                            <div className="flex flex-col">
                                <div className="text-base text-gray-800 font-semibold uppercase mb-2">Assets</div>
                                
                                <div className="px-4 my-1">
                                    <div className="border-2 border-gray-300 border-dashed rounded-lg py-8 px-2 text-center  font-semibold text-gray-700 cursor-pointer" {...getRootProps()}>
                                        <input {...getInputProps()}/>

                                        {
                                            isDragActive ? <p>Drop the file here...</p> : <p>Drag 'n' drop files here, or click to select file</p>
                                        }
                                    </div>

                                    {
                                        droppedFile && <div className="px-8">
                                            {
                                                <div className="border border-gray-300 text-gray-800 text-sm font-medium flex flex-row gap-x-10 justify-between items-center px-4 py-1.5 my-2 mt-4"><span className="line-clamp-1">{droppedFile.name}</span> <div className="flex flex-row items-center"><span>{Math.floor(droppedFile.size/1024)}kb</span><button className="ml-4" onClick={handleRemoveDroppedFile}><ImCancelCircle className="w-4 h-4 text-gray-600"/></button></div></div>
                                            }
                                            <div className="text-right">
                                                <button onClick={handleUploadImages} className="bg-blue-600 text-white text-sm font-bold px-4 py-1.5 mt-2">Upload</button>
                                            </div>
                                            
                                        </div>
                                    }
                                </div>

                                <div className="w-full border-t border-gray-200 my-4"></div>

                                <div className="px-4">
                                    {
                                        task.assets.map((asset) => (
                                            <div className="flex flex-row items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-800 font-medium" key={asset._id}>
                                                <a href={asset.url} target="_blank" className="text-blue-600 hover:text-blue-800 font-medium truncate line-clamp-1 mr-4">{asset.filename}</a>
                                                <div className="flex flex-row items-center gap-x-3 ">
                                                    {/* <button className=""><MdOutlineFileDownload className="w-6 h-6"/></button> */}
                                                    <span className="text-sm text-gray-600">{Math.floor(asset.bytes/1024)}kb</span>

                                                    {
                                                        (asset.by === loggedinUser._id || isUserTaskAdmin) && <button className="text-gray-500 hover:text-gray-700" onClick={(e) =>{e.stopPropagation(); handleDeleteAssetFromCloudinary(asset.public_id, asset.resource_type);}}><FaTrashAlt className="w-3.5 h-3.5"/></button>
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {
                    selected === 1 && <div className="flex flex-col sm:flex-row justify-between bg-white p-4 my-6">
                        <div className="sm:min-w-[300px] md:min-w-[350px] lg:min-w-[350px] xl:min-w-[500px]">
                            <div className="text-lg sm:text-xl text-gray-800 font-semibold">Activities</div>
                            <div className="pl-2 relative">
                                <div style={{"height": "calc(100% - 120px)"}} className="top-1/2 left-8 -translate-y-1/2 absolute z-1 border-l border-gray-300"></div>
                                {
                                    task.activities.map((activity, index) => (
                                        <div key={index} className="flex flex-row items-center my-6 z-3 relative">
                                            {
                                                TAGTYPEICON[activity.tag.toLowerCase()]
                                            }
                                            <div>
                                                <div className="text-lg text-gray-950">{activity.by.firstName}</div>
                                                <div className="text-[10px] text-gray-500">{dateFormatter(activity.createdAt)}</div>
                                                <div className="text-base text-gray-800 capitalize line-clamp-1">{activity.title}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="activityForm sm:min-w-[250px] md:min-w-[350px] mt-8 sm:mt-0 bg-white">
                            <form onSubmit={handleSubmit(handleAddActivity)}>
                                <div className="text-lg sm:text-xl text-gray-800 font-semibold">Add Activity</div>
                                <div className="my-1 sm:my-4 text-gray-800 flex flex-row items-start flex-wrap">
                                    {
                                        activities.map((activity, index) => (
                                            <div key={index} className="flex flex-row items-center text-base mr-6 my-2">
                                                <input className="w-4 h-4 mr-2" id={activity} {...register("tag")} type="radio" value={activity} />
                                                <label htmlFor={activity}>{activity}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="w-full sm:pr-8 my-3 sm:my-6">
                                    <input className="w-full border border-gray-300 text-gray-900 font-medium p-4 text-base placeholder:text-gray-400" {...register("title")} placeholder="Enter Activity Title Here..."/>
                                </div>
                                <div className="my-2 mt-6 sm:my-10 sm:pr-8 text-base flex flex-row items-center justify-end">
                                    <button type="submit" className="px-6 py-1.5 bg-blue-600 font-semibold text-white">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default TaskInfo;