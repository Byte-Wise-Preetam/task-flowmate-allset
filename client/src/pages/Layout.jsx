import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import SideBar from "../components/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { handleTokenExpiration, saveUser } from "../utils/loginUserSlice";
import { setTasks } from "../utils/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { LuMenu } from "react-icons/lu";
import { useCallback, useEffect, useMemo, useState } from "react";
import SearchTasksComponent from "../components/SearchTasksComponent";
import Spinner from "../components/loading/Spinner";
import { startLoading, stopLoading } from "../utils/loaderSlice";
import Toast from "../components/Toast";
import SEO from "../components/SEO";
import LogRocket from "logrocket";

const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isSidebarActive, setIsSidebarActive] = useState(true);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    const loggedinUser = useSelector((state) => state.loginUser.user);
    const { isLoading, loadingType, message } = useSelector((state) => state.loader.value);
    const toastInfo = useSelector(state => state.toast.value);

    const isTokenExpired = useCallback((token) => {
        if (!token) return true;
        try{
            const decodedToken = jwtDecode(token); 
            const currentTime = Date.now() / 1000; 
            return decodedToken.exp < currentTime;
        }catch (error) {
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Invalid token : ", error) : console.error("Invalid token : ", error);
            return true;
        }
    }, []);

    const handleOpenSidebar = useCallback(() => {
        if(viewportWidth < 1024){
            setIsSidebarActive((prev) => !prev);
        }
    }, [viewportWidth])

    const fetchTasks = useCallback(async () => {
        try{ 
            dispatch(startLoading({type: "layout", message: ""}));
            const tasksRes = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/tasks/`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            })

            const data = await tasksRes.json();

            if(data.status){
                const {tasks} = data;
                dispatch(setTasks(tasks));
            }
            else if(data?.message === "Token has Expired. Please login again."){
                dispatch(handleTokenExpiration());
            }
            else{
                navigate("/sign-in");
            }
        }catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Failed to fetch tasks : ", error) : console.error("Failed to fetch tasks : ", error);
        }
        finally{
            dispatch(stopLoading());
        }
    }, [dispatch])

    useEffect(() => {

        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {

        if (viewportWidth < 1024) {
            setIsSidebarActive(false); 
        } else {
            setIsSidebarActive(true); 
        }
    }, [viewportWidth])

    useEffect(() => {

        const storedUser = sessionStorage.getItem('user');

        if (!storedUser) {
            Cookies.remove('auth_token');
            sessionStorage.removeItem('user');
            navigate('/sign-in');
            return;
        }

        try{
            dispatch(saveUser(JSON.parse(storedUser)));
            fetchTasks();
        }catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error parsing stored user", error) : console.error("Error parsing stored user : ", error);
            navigate('/sign-in');
        }

    },[dispatch, navigate, isTokenExpired, fetchTasks]);

    useEffect(() => {
        if(loggedinUser._id){
            sessionStorage.setItem('user', JSON.stringify(loggedinUser));
        }
    },[loggedinUser])

    const userInitials = useMemo(() => {
        return `${loggedinUser?.firstName ? loggedinUser.firstName[0] : ''}${loggedinUser?.lastName ? loggedinUser.lastName[0] : ''}`;
    }, [loggedinUser]);

    return(
        <>
            <SEO
                title="Dashboard - Task Management and Workflow Tool"
                description="FlowMate's dashboard offers seamless task management and streamlined workflow. Collaborate with your team, track task progress, and boost productivity."
                keywords="FlowMate, task management, workflow, team collaboration, project tracking, task dashboard, productivity tool, task prioritization"
            />
            <div style={{fontFamily: "var(--nunito)"}} className="max-w-[1536px] mx-auto w-[100%] flex flex-row">

                {
                    isLoading && <Spinner/>
                }

                {/* <Spinner/> */}

                { isSidebarActive && <SideBar handleOpenSidebar={handleOpenSidebar}/>} 

                <div className="bg-[#f3f4f6] max-h-[100vh] dashboard_rightArea">
                    {/* Right body header starts here */}

                    <div className="w-full bg-white h-[70px] flex flex-row items-center justify-between px-2 sm:px-8">
                        <div className="flex flex-row items-center">
                            <button onClick={handleOpenSidebar}><LuMenu className="lg:hidden w-6 h-6 mr-4"/></button>
                            <SearchTasksComponent/>
                        </div>
                        <div className="w-10 h-10 flex flex-row items-center justify-center rounded-[50%] text-base font-semibold bg-green-600 text-white ">
                            { userInitials }
                        </div>
                    </div>

                    <div className="overflow-y-scroll" style={{height: "calc(99vh - 70px)"}}>
                        <Outlet/>
                    </div>
                    
                </div>

                {
                    toastInfo.isActive && <Toast/>
                }
            </div>
        </>
    )
}

export default Layout;