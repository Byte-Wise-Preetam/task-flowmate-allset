import { Description } from "@headlessui/react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { dateFormatter } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import { openForm, closeForm } from "../../utils/tasksFormsSlice";
import { addSubtask } from "../../utils/tasksSlice";
import { startLoading, stopLoading } from "../../utils/loaderSlice";
import { setToastVisible } from "../../utils/toastNotifiactionSlice";
import { handleTokenExpiration } from "../../utils/loginUserSlice";
import LogRocket from "logrocket";

const AddsubTask = () => {

    const dispatch = useDispatch();
    const {isOpen, actionType, isSubTask, currentData} = useSelector((state) => state.taskForms);

    const taskToEdit = currentData;

    const handleOnSubmit = useCallback(async (data) => {
        try{
            dispatch(startLoading({type: "Create", message: "Creating Subtask..."}));

            const newSubtask = {
                title: data.title,
                tag: data.tag,
                lastDate: data.lastDate
            }

            if(actionType === "add"){
                const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/${currentData}/sub-task`,{
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newSubtask)
                });

                const data = await res.json();

                if(data.status){
                    const { newSubTasks } = data;
                    dispatch(addSubtask({taskId: currentData, newSubTasks}));
                    dispatch(setToastVisible({message: `Subtask created successfully`, type:"add"}));
                }
                else if(data?.message === "Token has Expired. Please login again."){
                    dispatch(handleTokenExpiration());
                }
            }
        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in creating Subtask", error) : console.error("Error in creating Subtask", error);
        }
        finally{
            dispatch(closeForm());

            dispatch(stopLoading());
        }
    }, []);

    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        if(taskToEdit){
            setValue("title", taskToEdit.title);
            // setValue("description", taskToEdit.description);
            setValue("tag", taskToEdit.tag);
            setValue("lastDate", dateFormatter(taskToEdit.lastDate));
        }else{
            reset();
        }
    }, [])

    return(
        <div style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}} className="absolute top-0 left-0 w-full h-[99.9vh] flex flex-row justify-center items-center">
            <form onSubmit={handleSubmit(handleOnSubmit)} className="w-[90%] sm:w-[500px] px-4 sm:px-8 py-2 sm:py-4 rounded-lg bg-white">
                <div className="text-xl text-black my-4 font-semibold capitalize">{actionType} Sub-Task</div>
                <div className="my-2 sm:my-4 w-full flex flex-col text-gray-800">
                    <label htmlFor="title" className="text-base mb-1 text-black">Title</label>
                    <input
                        className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                        placeholder="Enter Title Here..."
                        id="title"
                        {...register("title", { required: "Title is required" })}
                    />
                </div>

                {/* <div className="my-4 w-full flex flex-col text-gray-800">
                    <label htmlFor="description" className="text-base mb-1 text-black">Description</label>
                    <input
                        className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                        placeholder="Enter description Here..."
                        id="description"
                        {...register("description", { required: "description is required" })}
                    />
                </div> */}

                <div className="amy-2 sm:my-4 w-full flex flex-col gap-y-2 sm:flex-row justify-between items-center">
                    <div className="w-full sm:w-[200px] flex flex-col text-gray-800">
                        <label htmlFor="tag" className="text-base mb-1 text-black">Tag</label>
                        <input
                            className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                            placeholder="Enter Tag Here..."
                            id="tag"
                            {...register("tag", { required: "Tag is required" })}
                        />
                    </div>

                    <div className="w-full sm:w-[200px] flex flex-col text-gray-800">
                        <label htmlFor="lastDate" className="text-base mb-1 text-black">Last Date</label>
                        <input
                            id="lastDate"
                            className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                            {...register("lastDate", { required: "Task date is required" })}
                            type="date"
                        />
                    </div>
                </div>

                <div className="mt-4 sm:mt-8 mb-4 text-base flex flex-row items-center justify-end">
                    <button onClick={() => dispatch(closeForm())} className="mr-8">Cancel</button>
                    <button type="submit" className="px-6 py-1.5 bg-blue-600 font-semibold text-white">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AddsubTask;