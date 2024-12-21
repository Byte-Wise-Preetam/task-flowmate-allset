import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeForm } from "../utils/adminTeamSlice";
import { addTeamMember, editTeamMember, handleTokenExpiration } from "../utils/loginUserSlice";
import { startLoading, stopLoading } from "../utils/loaderSlice";
import LogRocket from 'logrocket';

const AddUser = () => {

    const dispatch = useDispatch();
    const { isOpen, actionType, currentData } = useSelector(state => state.adminTeamForms);
    const userToEdit = currentData;

    const { register, handleSubmit, reset, setValue } = useForm();

    const handleOnSubmit = useCallback(async (data) => {
        try{
            dispatch(startLoading({type: "Add", message: `${actionType}ing User`}));

            const enteredUser = {
                newMemberEmail: data.email,
                role: data.role
            }

            if(actionType==="add"){
                const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/user/add-member`,{
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(enteredUser)
                });

                const data = await res.json();

                if(data.status){
                    dispatch(addTeamMember(data?.populatedUser.team));
                }else if(data?.message === "Token has Expired. Please login again."){
                    dispatch(handleTokenExpiration());
                }

            }

            if(actionType === "edit"){

                enteredUser.newMemberEmail = userToEdit.email;

                if(userToEdit.role === enteredUser.role){
                    reset();
                    dispatch(closeForm())
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/user/edit-member`,{
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(enteredUser)
                });

                const data = await res.json();

                if(data.status)
                {
                    dispatch(editTeamMember(data?.member));
                }else if(data?.message === "Token has Expired. Please login again."){
                    dispatch(handleTokenExpiration());
                }
            }
        }
        catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in Adding/Editing User", error) : console.error("Error in Adding/Editing User : ", error);
        }
        finally{
            reset();

            dispatch(closeForm());
            
            dispatch(stopLoading());
        }
    }, [dispatch, reset])

    useEffect(() => {
        if(actionType === "edit" && userToEdit){
            setValue("role", userToEdit.role);
        }
        else{
            reset();
        }
    }, [])

    return(
        <div style={{backgroundColor: "rgba(0, 0, 0, 0.3)"}} className="absolute top-0 left-0 w-full h-[99.9vh] flex flex-row justify-center items-center">
            <form id="taskForm" onSubmit={handleSubmit(handleOnSubmit)} className="w-[90%] sm:w-[475px] px-4 sm:px-8 py-4 rounded-lg bg-white">
                <div className="text-xl text-black my-4 font-semibold capitalize">{actionType === "add" && "Add New"}{actionType === "edit" && "Edit"} User</div>

                {
                    actionType !== "edit" && <div className="my-4 w-full flex flex-col text-gray-800">
                        <label htmlFor="email" className="text-base mb-1 text-black">Email Address</label>
                        <input
                            type="email"
                            className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                            placeholder="Enter Email Here..."
                            id="email"
                            {...register("email", { required: "Email Address is required" })}
                        />
                    </div>
                }

                <div className="my-4 w-full flex flex-col text-gray-800">
                    <label htmlFor="role" className="text-base mb-1 text-black">Role</label>
                    <input
                        type="role"
                        className="px-3 py-2.5 text-sm border rounded border-gray-300 placeholder-gray-400"
                        placeholder="Enter Role Here..."
                        id="role"
                        {...register("role", { required: "Role is required" })}
                    />
                </div>

                <div className="mt-8 mb-4 text-base flex flex-row items-center justify-end">
                    <button className="mr-8" onClick={() => dispatch(closeForm())}>Cancel</button>
                    <button type="submit" className="px-6 py-1.5 bg-blue-600 font-semibold text-white">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default AddUser;