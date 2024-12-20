import { IoMdAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { openForm } from "../utils/adminTeamSlice";
import AddUser from "../components/AddUser";
import { handleTokenExpiration, removeUser } from "../utils/loginUserSlice";
import Spinner from "../components/loading/Spinner";
import { startLoading, stopLoading } from "../utils/loaderSlice";
import { useCallback } from "react";
import SEO from "../components/SEO";
import LogRocket from "logrocket";


const team = [
    {
        _id: "6741973b89e695aa41fc323f",
        firstName: "Emily",
        lastName: "Wilson",
        role: "UI/UX Designer",
        email: "emily.wilson@gmail.com"
    },
    {
        _id: "6741973b89f895aa12fc323f",
        firstName: "Alex",
        lastName: "Johnson",
        role: "Analyst",
        email: "alex.johnson@gmail.com"
    },
    {
        _id: "6743473b89f895aa41fc323f",
        firstName: "Jane",
        lastName: "Smith",
        role: "Back-end Developer",
        email: "jane.smith@gmail.com"
    },
    {
        _id: "6747873b89f895aa41fc323f",
        firstName: "Codewave",
        lastName: "Asante",
        role: "Full-stack Developer",
        email: "codewave.asante@gmail.com"
    }
]

const Users = () => {

    const dispatch = useDispatch();
    const adminTeam = useSelector(state => state.adminTeamForms);
    const { team } = useSelector(state => state.loginUser.user);
    const { isLoading, loadingType, message } = useSelector(state => state.loader.value);

    const TableRow = ({user}) => {

        if(!user){
            return <div>loading...</div>
        }

        const { role, email } = user;

        const {firstName, lastName } = user.memberId;

        const handleRemoveTeamMember = useCallback(async (teamMemberEmail) => {
            try{
                dispatch(startLoading({type:"Delete", message: "Removing member from team..."}));

                const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/user/remove-member`,{
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({memberEmail: teamMemberEmail})
                })

                const data = await res.json();

                if(data.status){
                    dispatch(removeUser(teamMemberEmail));
                }
                else if(data?.message === "Token has Expired. Please login again."){
                    dispatch(handleTokenExpiration());
                }
                
            }catch(error){
                import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in removing team member : ", error) : console.error("Error in removing team member : ",error);
            }
            finally{
                dispatch(stopLoading());
            }

        }, [dispatch])

        return (
            <tr className="text-gray-600 border-b border-gray-300 last:border-0">

                <td className="w-[250px] py-4 pl-4">
                    <div className="flex flex-row items-center">
                        <div className="text-lg w-12 h-12 text-white flex flex-row justify-center items-center rounded-[50%] mr-4 bg-blue-600">
                            {firstName[0]}{lastName[0]}
                        </div>
                        <div className="text-base text-gray-800">{firstName} {lastName}</div>
                    </div>
                </td>

                <td className="w-[250px] py-4">
                    <div className="text-center text-base text-gray-500">{role}</div>
                </td>

                <td className="w-[300px] py-4">
                    <div className="text-center text-base text-gray-500">{email}</div>
                </td>

                <td className="w-[200px] py-4">
                    <div className="text-base flex flex-row justify-center items-center">
                        <button className="text-blue-600 mr-5" onClick={() => dispatch(openForm({actionType:"edit", data:user}))}>Edit</button>
                        <button className="text-red-700" onClick={() => handleRemoveTeamMember(user.email)}>Delete</button>
                    </div>
                </td>
            </tr>
        )
    }

    return(
        <>
            <SEO
                title="Dashboard - Manage Users"
                description="Effortlessly manage your team with FlowMate. Add, edit, and organize users to optimize collaboration and task assignments across your projects."
                keywords="manage users, FlowMate, team management, user roles, team collaboration, user administration, task assignments, project management"
            />

            <div className="w-full max-w-[1536px] px-8">
                <div className="flex flex-row justify-between items-center my-6 mx-auto">
                    <div className="text-2xl md:text-3xl font-semibold capitalize">Team Members</div>
                    <button className="flex flex-row items-center justify-center bg-blue-600 sm:text-sm text-base text-white font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-md" onClick={() => dispatch(openForm({actionType: "add"}))}>
                        <IoMdAdd className="w-5 h-5 mr-1"/> 
                        <span>Add New User</span>
                    </button>
                </div>

                {

                    team ? <div className="overflow-x-scroll mt-8 px-8 mb-4 mx-auto bg-white flex flex-row">
                        <table className="bg-white min-w-[1040px] mx-auto">
                            <thead className='w-full border-b border-gray-500'>
                                <tr className='w-full text-black text-lg text-center'>
                                    <th className='py-5 line-clamp-1'>Full Name</th>
                                    <th className='py-5'>Role</th>
                                    <th className='py-5 line-clamp-1'>Email</th>
                                    <th className='py-5'></th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    team.map((user) => (
                                        <TableRow key={user._id} user={user}/>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div> : <div className="max-w-[1040px] mx-auto">No Team Members...</div>
                }
            </div>

            {
                adminTeam.isOpen && <AddUser/>
            }

            {
                isLoading && <Spinner/>
            }
        </>
    )
}

export default Users;