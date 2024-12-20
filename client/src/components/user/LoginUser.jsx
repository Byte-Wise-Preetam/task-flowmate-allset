import Cookies from "js-cookie";
import loginUser_BG from "../../assets/images/Hero_BG.webp"
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { saveUser } from "../../utils/loginUserSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoFlowerOutline } from "react-icons/io5";
import { GoWorkflow } from "react-icons/go";
import { RxActivityLog } from "react-icons/rx";
import { startLoading, stopLoading } from "../../utils/loaderSlice";
import { useSelector } from "react-redux";
import Spinner from "../loading/Spinner";
import { setToastVisible } from "../../utils/toastNotifiactionSlice";
import SEO from "../SEO";
import LogRocket from "logrocket";

const LoginUser = () => {
    const { register, handleSubmit, reset } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, loadingType, message } = useSelector((state) => state.loader.value);

    const handleOnSubmit = useCallback(async (userData) => {
        try {

            dispatch(startLoading({type: "login", message: "logging you in..."}));

            const credentials = {
                email: userData.email,
                password: userData.password,
            };

            // Send login request
            const res = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/user/login`, {
                method: "POST",
                credentials: "include",  // Ensure cookies are included in request
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            // Check if response is successful
            if (!res.ok) {
                throw new Error("Failed to login. Please try again.");
            }

            const data = await res.json();

            if (data?.status) {
                // Set auth token and user data in cookies and sessionStorage
                // Cookies.set('auth_token', data?.token, { expires: 1 });

                const user = data.user;

                const authorizedUser = {
                    _id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    team: user.team
                };

                dispatch(saveUser(authorizedUser));
                sessionStorage.setItem('user', JSON.stringify(authorizedUser));

                dispatch(setToastVisible({message: "Login Sucessful", type:"success"}));

                navigate('/dashboard/tasks');
            }

        } catch (error) {
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error: ", error.message || "An unknown error occurred") : console.error("Error: ", error.message || "An unknown error occurred");
            dispatch(setToastVisible({message: "Login Failed", type:"bug"}));
        } finally {
            // Reset form after successful login or error
            dispatch(stopLoading());

            reset();
        }
    }, [dispatch, reset, navigate]);

    const checkAuthentication = useCallback(async () => {
        try{

            const storedUser = sessionStorage.getItem('user');

            const authTokenRes = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/user/auth-token`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const authData = await authTokenRes.json();

            if(storedUser && authData.status){
                dispatch(saveUser(JSON.parse(storedUser)));
                navigate('/dashboard/tasks');
            }
        }catch(error){
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error: ", error.message || "An unknown error occurred") : console.error("Error: ", error.message || "An unknown error occurred");
        }
    }, [])

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication])

    return (
        <>
            <SEO
                title="Login"
                description="Login to FlowMate to manage tasks, collaborate with your team, and streamline your workflow. Access your personalized dashboard to boost productivity."
                keywords="FlowMate login, task management login, team collaboration, productivity, login page, task dashboard, workflow management"
            />

            <div style={{fontFamily: "var(--nunito)", background: `url(${loginUser_BG})`, backgroundSize: "100% 100%"}} className="max-w-[1536px] mx-auto relative h-[99.9vh] flex flex-row justify-center items-center">
                {
                    isLoading && <Spinner/>
                }

                <div className="md:max-w-[750px] lg:max-w-[990px] xl:max-w-[1280px] max-h-[90%] overflow-y-scroll mx-auto  py-4 lg:py-0 flex flex-col gap-y-10 lg:flex-row gap-x-10 justify-start lg:justify-center items-center">
                    <div className="text-center px-8 lg:px-0">
                        <div className="text-sm font-bold text-blue-600">FUEL YOUR PRODUCTIVITY</div>

                        <div className="max-w-[650px] text-5xl leading-[60px] my-2 font-bold uppercase text-gray-700">Welcome back to <span style={{backgroundImage: "linear-gradient(90deg,#4f57f9,#c9a0ff)", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>FlowMate</span>, let’s get <span style={{backgroundImage: "linear-gradient(90deg,#4f57f9,#c9a0ff)", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>things done!</span></div>
                        <div className="max-w-[400px] text-[17px] sm:text-xl md:text-2xl md:w-[500px] mx-auto font-semibold text-gray-500 capitalize">Continue managing tasks and collaborating effortlessly.</div>

                        <div className="text-base font-semibold mt-6 lg:mt-12 text-gray-800">
                            <span className="">Don't have an account ?</span>
                            <Link to="/register" className="text-blue-600 ml-2">Sign up</Link>
                        </div>
                        <div>
                            <Link to="/" className="text-gray-800 text-[12px] font-bold ml-2 underline">Back to Home</Link>
                        </div>
                    </div>

                    <div className="">
                        <form
                            onSubmit={handleSubmit(handleOnSubmit)}
                            className="w-[90%] sm:w-[500px] px-4 sm:px-8 py-4 rounded-lg border border-gray-400"
                        >
                            <div className="text-2xl text-gray-800 font-semibold capitalize">Sign in</div>

                            {/* <div className="border-t border-gray-400 my-3"></div> */}

                            <div className="my-4 w-full flex flex-col text-gray-800">
                                <label htmlFor="email" className="text-base mb-1 font-semibold">
                                    Email
                                </label>
                                <input
                                    className="px-3 py-2.5 text-sm border rounded border-gray-400 placeholder-gray-400"
                                    placeholder="Enter Email Here..."
                                    id="email"
                                    {...register("email", { required: "Email is required" })}
                                />
                            </div>

                            <div className="my-4 w-full flex flex-col text-gray-800">
                                <label htmlFor="password" className="text-base mb-1 font-semibold">
                                    Password
                                </label>
                                <input
                                    className="px-3 py-2.5 text-sm border rounded border-gray-400 placeholder-gray-400"
                                    placeholder="Enter Password Here..."
                                    id="password"
                                    {...register("password", { required: "Password is required" })}
                                />
                            </div>

                            <div className="mt-6 sm:mt-8 mb-2 text-base flex flex-row items-center justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-1.5 bg-blue-600 font-semibold text-white"
                                >
                                    Submit
                                </button>
                            </div>
                            
                        </form>

                        <div className="flex flex-col items-end mt-2">
                            <div className="w-[200px] text-gray-900 font-bold">Test Credentials :</div>
                            <div className="w-[200px] text-gray-800 font-semibold text-sm sm:text-base">test.app@flowmate.com</div>
                            <div className="w-[200px] text-gray-800 font-semibold text-sm sm:text-base">test@123</div>
                        </div>
                    </div>
                </div>

                <div className="floatingTags absolute -left-8 bottom-16 bg-white py-2 px-4 pl-10 flex flex-row items-center font-semibold text-gray-800 shadow-lg rounded-md border border-gray-300"><IoFlowerOutline className="mr-2 text-blue-600"/> <span>Streamlined Workflow</span></div>

                <div className="floatingTags absolute left-0 bottom-[90%] lg:left-1/2 lg:bottom-8 bg-white py-2 px-4 pr-6 flex flex-row items-center font-semibold shadow-md border border-gray-300 text-gray-800 rounded-md"><GoWorkflow className="mr-2 text-blue-600"/>Customizable Workflow</div>

                <div className="floatingTags absolute right-0 top-10 bg-white py-2 px-4 pr-6 flex flex-row items-center font-semibold shadow-md border border-gray-300 text-gray-800 rounded-md rounded-tr-none rounded-br-none"><RxActivityLog className="mr-2 text-blue-600"/>Activity Log</div>
            </div>
        </>
    );
};

export default LoginUser;
