import { useState, useEffect, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineCancel } from "react-icons/md";
import { IoCheckmark } from "react-icons/io5";
import { RiExpandUpDownLine } from "react-icons/ri";
import { dateFormatter } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { closeForm } from "../../utils/tasksFormsSlice";
import { addNewTask, updateTask } from "../../utils/tasksSlice";
import { startLoading, stopLoading } from "../../utils/loaderSlice";
import { setToastVisible } from "../../utils/toastNotifiactionSlice";
import { handleTokenExpiration } from "../../utils/loginUserSlice";
import LogRocket from "logrocket";

const PRIORITY = ["HIGH", "MEDIUM", "LOW"];

const AddTask = ({}) => {

    const dispatch = useDispatch();
    const {isOpen, actionType, isSubTask, currentData} = useSelector((state) => state.taskForms);
    
    const loggedInUser = useSelector(state => state.loginUser);
    const loggedInUserTeam = loggedInUser.user.team;

    const taskToEdit = currentData;

    const [isTeamListOpen, setIsTeamListOpen] = useState(false);
    const [team, setTeam] = useState([]);
    const { register, handleSubmit, reset, setValue } = useForm();

    const teamListRef = useRef(null);

    const handleOnSubmit = useCallback(async (data) => {
        try{
            dispatch(startLoading({type: "task", message: `${actionType}ing Task`}));
        
            const newTaskData = {
                title: data.title,
                description: data.description,
                priority: data.priority.toLowerCase(),
                lastDate: data.lastDate,
                team,
            };

            if(actionType === "add"){

                const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTaskData)
                })

                const data = await res.json();

                if(data.status){
                    dispatch(addNewTask(data.newTask));
                    dispatch(setToastVisible({message: `Task created successfully`, type:"add"}));
                }
                else if(data?.message === "Token has Expired. Please login again."){
                    dispatch(handleTokenExpiration());
                }

                return;
            }

            if(actionType === "edit"){
                const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${taskToEdit._id}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newTaskData)
                })

                const data = await res.json();

                if(data.status){
                    dispatch(updateTask(data.task));
                    dispatch(setToastVisible({message: `Task edited successfully`, type:"edit"}));
                }
                else if(data?.message === "Token has Expired. Please login again."){
                    dispatch(handleTokenExpiration());
                }

                return;
            }
        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error(`Error in ${actionType}ing task : `, error) : console.error(`Error in ${actionType}ing task : `, error);
        }
        finally{
            dispatch(closeForm());

            dispatch(stopLoading());
        }
    }, [actionType, team, taskToEdit, dispatch]);

    const removeMember = useCallback((oldMember) => {
        setTeam((prevTeam) => prevTeam.filter((member) => member._id !== oldMember._id));
    }, []);

    const isMemberPresent = useCallback((queryMember) => team.findIndex((member) => member._id === queryMember._id), [team]);

    const handleMemberClick = useCallback((newMember) => {
        const memberIndex = isMemberPresent(newMember);
        if (memberIndex === -1) {
            setTeam((prevTeam) => [...prevTeam, newMember]);
        } else {
            removeMember(newMember);
        }
    }, [isMemberPresent, removeMember]);
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (teamListRef.current && !teamListRef.current.contains(event.target)) {
                setIsTeamListOpen(false);
            }
        };

        // Add event listener when dropdown is open
        if (isTeamListOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isTeamListOpen]);

    useEffect(() => {
        if(taskToEdit){
            setValue("title", taskToEdit.title);
            setValue("description", taskToEdit.description);
            setValue("priority", taskToEdit.priority.toUpperCase());
            setValue("lastDate", dateFormatter(taskToEdit.lastDate));
            setTeam(taskToEdit.team || []);
        }
        else{
            reset();
        }
    },[taskToEdit, setValue, reset])

    return (
        <div style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}} className="absolute top-0 left-0 w-full h-[99.9vh] overflow-y-scroll flex flex-row justify-center items-center z-10">
            <form id="taskForm" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit(handleOnSubmit)} className="w-[90%] sm:w-[500px] px-4 sm:px-8 py-2 sm:py-4 rounded-lg bg-white">
                <div className="text-xl text-black my-2 mb-4 sm:my-4 font-semibold capitalize">{actionType} Task</div>

                <div className="my-2 sm:my-4 w-full flex flex-col text-gray-800">
                    <label htmlFor="title" className="text-base mb-1 text-black">Task Title</label>
                    <input
                        className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                        placeholder="Enter Title Here..."
                        id="title"
                        {...register("title", { required: "Title is required" })}
                    />
                </div>

                <div className="my-2 sm:my-4 w-full flex flex-col text-gray-800">
                    <label htmlFor="description" className="text-base mb-1 text-black">Task Description</label>
                    <input
                        id="description"
                        className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                        placeholder="Enter Description Here..."
                        {...register("description", { required: "Description is required" })}
                    />
                </div>

                <div ref={teamListRef} className="my-2 sm:my-4 w-full flex flex-col text-gray-800 text-sm">
                    <label htmlFor="team" className="text-base mb-1 text-black">Assign Task To:</label>
                    <div
                        className="cursor-pointer min-h-[44px] py-2 text-sm border rounded border-gray-300 relative flex flex-row items-center flex-wrap"
                        onClick={() => setIsTeamListOpen((prev) => !prev)}
                    >
                        {team.length === 0 ? (
                            <span className="text-gray-400 ml-3">New User</span>
                        ) : (
                            team.map((member) => (
                                <div key={member._id} className="flex flex-row items-center text-sm border-2 py-1 px-2 m-1 rounded-[2rem]">
                                    <span className="capitalize">{member.memberId.firstName} {member.memberId.lastName}</span>
                                    <button onClick={(e) => { e.stopPropagation(); removeMember(member); }}>
                                        <MdOutlineCancel className="ml-2" />
                                    </button>
                                </div>
                            ))
                        )}

                        <RiExpandUpDownLine className="w-6 h-6 text-gray-600 absolute right-4 top-1/2 -translate-y-1/2" />

                        {isTeamListOpen && (
                            <div className="w-full max-h-[200px] overflow-y-scroll absolute top-[105%] left-0 bg-white border-2 border-gray-200 rounded-md shadow-lg">
                                {loggedInUserTeam.map((member) => (
                                    <div
                                        key={member._id}
                                        className="w-full flex flex-row items-center justify-start text-base py-2 hover:bg-gray-100"
                                        onClick={(e) => { e.stopPropagation(); handleMemberClick(member); }}
                                    >
                                        <span className="inline-block w-8 h-8 mx-2 flex flex-row justify-center items-center text-red-600">
                                            {isMemberPresent(member) === -1 ? "" : <IoCheckmark className="w-6 h-6" />}
                                        </span>
                                        <span className="w-8 h-8 text-sm text-white bg-purple-600 rounded-[50%] flex flex-row justify-center items-center uppercase mr-2">
                                            {member.memberId.firstName[0]}{member.memberId.lastName[0]}
                                        </span>
                                        <span className="capitalize">{member.memberId.firstName} {member.memberId.lastName}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="my-2 sm:my-4 w-full flex flex-col gap-y-2 sm:flex-row justify-between items-center">
                    <div className="w-full sm:w-[200px] flex flex-col text-gray-800">
                        <label htmlFor="priority" className="text-base mb-1 text-black">Priority Level</label>
                        <select
                            id="priority"
                            className="p-2.5 text-sm border rounded border-gray-300 placeholder-gray-400 text-gray-700"
                            {...register("priority", { required: "Priority is required" })}
                        >
                            <option value="" disabled selected>Select Priority</option>
                            {PRIORITY.map((tag, index) => (
                                <option key={index} value={tag}>{tag}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full sm:w-[200px] flex flex-col text-gray-800">
                        <label htmlFor="lastDate" className="text-abse mb-1 text-black">Task Date</label>
                        <input
                            id="lastDate"
                            className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                            {...register("lastDate", { required: "Task date is required" })}
                            type="date"
                        />
                    </div>
                </div>

                <div className="mt-4 sm:mt-8 mb-4 text-base flex flex-row items-center justify-end">
                    <button className="mr-8" onClick={() => dispatch(closeForm())}>Cancel</button>
                    <button type="submit" className="px-6 py-1.5 bg-blue-600 font-semibold text-white">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default AddTask;
