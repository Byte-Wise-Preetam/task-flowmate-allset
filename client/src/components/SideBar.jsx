import { IoLogOutOutline } from "react-icons/io5";
import { PiQueueBold } from "react-icons/pi";
import { MdOutlinePendingActions, MdTaskAlt } from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../utils/loginUserSlice";
import { useCallback } from "react";
import { SiOpenhab } from "react-icons/si";
import LogRocket from "logrocket";

const ICONSTYLE = "h-4 w-4 font-medium mr-3";

const linkData = [
    {
        label: "Tasks",
        link: "tasks",
        icon: <FaTasks className={ICONSTYLE}/>
    },
    {
        label: "Completed",
        link: "tasks/completed",
        icon: <MdTaskAlt className={ICONSTYLE}/>
    },
    {
        label: "Active",
        link: "tasks/active",
        icon: <PiQueueBold className={ICONSTYLE}/>
    },
    {
        label: "In Queue",
        link: "tasks/inqueue",
        icon: <MdOutlinePendingActions className={ICONSTYLE}/>
    },
    {
        label: "Team",
        link: "team",
        icon: <FaUsers className={ICONSTYLE}/>
    },
    {
        label: "Trash",
        link: "tasks/trashed",
        icon: <FaTrashAlt className={ICONSTYLE}/>
    }
]

const SideBar = ({handleOpenSidebar}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogoutUser = useCallback(async () => {
        try{
            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/user/logout`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if(!res.ok){
                throw new Error("Failed to logout. Please try again.");
            }

            dispatch(logOut());
            navigate("/");

        }catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in logging out : ", error) : console.error("Error in logging out : ", error);
        }
    }, [dispatch, navigate])

    const handleCloseSidebar = useCallback((e) => {
        if (!e.target.closest("#sidebarContent")) {
            handleOpenSidebar();
        }  
    }, [handleOpenSidebar])

    return(
        <div className="sidebar h-[100vh] z-10 lg:z-0" onClick={handleCloseSidebar}>
            <div style={{fontFamily: "var(--nunito)"}} id="sidebarContent" className="bg-white flex flex-col justify-between w-[275px] h-full pl-6 pt-20 pb-4 relative">

                <div className="absolute top-4">
                        <Link to="/dashboard/tasks" className="flex flex-row items-center">
                            <SiOpenhab className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-blue-600"/>
                            <span className="text-2xl sm:text-3xl font-semibold text-gray-800">FlowMate</span>
                        </Link>
                    {/* <a className="text-4xl font-semibold">LogoTask</a> */}
                </div>

                <div className="w-full">
                    {
                        linkData.map((link, index) => (
                            <div key={index} className="max-w-[200px] my-3 text-gray-800">
                                <NavLink
                                    to={`/dashboard/${link.link}`} 
                                    onClick={handleOpenSidebar}
                                    className={({ isActive }) => 
                                        isActive 
                                        ? "w-full pl-4 py-2 flex flex-row items-center rounded-[2rem] cursor-pointer bg-blue-700 text-white font-semibold"
                                        : "w-full pl-4 py-2 flex flex-row items-center rounded-[2rem] cursor-pointer"
                                    }
                                    end={link.link === "tasks" ? true : false}
                                >
                                    {link.icon}
                                    <span className="text-base">{link.label}</span>
                                </NavLink>
                            </div>
                        ))
                    }
                </div>

                <div>
                    <a className="text-red-600 font-semibold w-full pl-4 py-2 flex flex-row items-center rounded-[2rem] cursor-pointer">
                        <IoLogOutOutline className="h-6 w-6 mr-2" />
                        <span onClick={handleLogoutUser} className="text-lg">Logout</span>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default SideBar