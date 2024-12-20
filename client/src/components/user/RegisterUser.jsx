import { useForm } from "react-hook-form";
import registerUser_BG from "../../assets/images/Hero_BG.webp"
import { Link } from "react-router-dom";
import { IoFlowerOutline } from "react-icons/io5";
import { RxActivityLog } from "react-icons/rx";
import { GoWorkflow } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import Spinner from "../loading/Spinner";
import SEO from "../SEO";
import LogRocket from "logrocket";

const RegisterUser = () => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleOnSubmit = useCallback(async (data) => {
        const newUser = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        }

        try {
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/user/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            });
    
            if (response.ok) {
                reset(); 
                navigate("/sign-in");
            }
        } catch (error) {
            import.meta.env.VITE_APP_MODE_ON === "production" ? LogRocket.error("Error in regiter new user : ", error) : console.error("Error in regiter new user : ", error);
        }
        finally{
            setIsLoading(false);
        }
    }, [navigate, reset])

    return (
        <>
            <SEO
                title="Register"
                description="Create your FlowMate account and start managing tasks, collaborating with your team, and improving productivity. Sign up today to access your personalized dashboard."
                keywords="FlowMate register, task management sign up, team collaboration, productivity, register page, create account, task dashboard, workflow management"
            />

            <div style={{fontFamily: "var(--nunito)", background: `url(${registerUser_BG})`, backgroundSize: "100% 100%"}} className="max-w-[1536px] mx-auto relative h-[99.9vh] flex flex-row justify-center items-center">
                <div className="md:max-w-[750px] lg:max-w-[990px] xl:max-w-[1280px] max-h-[90%] overflow-y-scroll mx-auto py-4 lg:py-0 flex flex-col gap-y-10 lg:flex-row gap-x-10 justify-start lg:justify-center items-center">
                    <div className="text-center">
                        <div className="text-sm font-bold text-blue-600">FUEL YOUR GROWTH</div>

                        <div className="max-w-[650px] text-4xl xl:text-5xl leading-[45px] xl:leading-[60px] my-2 font-bold uppercase text-gray-800">Welcome to <span style={{backgroundImage: "linear-gradient(90deg,#4f57f9,#c9a0ff)", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>FlowMate</span> let's achieve more!</div>
                        <div className="max-w-[400px] text-[17px] sm:text-xl md:text-2xl md:w-[500px] mx-auto font-semibold text-gray-500 capitalize">where seamless collaboration and task management come together.</div>

                        <div className="text-base font-semibold mt-6 sm:mt-12 text-gray-800">
                            <span className="">Already have an account ?</span>
                            <Link to="/sign-in" className="text-blue-600 ml-2">Sign in</Link>
                        </div>

                        <div>
                            <Link to="/" className="text-gray-800 text-[12px] font-bold ml-2 underline">Back to Home</Link>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(handleOnSubmit)} className="w-[90%] sm:w-[475px] px-6 py-4 rounded-lg border border-gray-400">
                        <div className="text-2xl text-gray-800 font-semibold capitalize">Create your account</div>

                        {/* <div className="border-t border-gray-400 my-3"></div> */}

                        <div className="my-4 flex flex-col sm:flex-row gap-x-5 gap-y-4">
                            <div className="w-full flex flex-col text-gray-800">
                                <label htmlFor="firstName" className="text-base mb-1 font-semibold">Firstname</label>
                                <input
                                    className="px-3 py-2.5 text-sm border rounded border-gray-400 placeholder-gray-400"
                                    placeholder="Enter Firstname Here..."
                                    id="firstName"
                                    {...register("firstName", { required: "Firstname is required" })}
                                />
                            </div>

                            <div className="w-full flex flex-col text-gray-800">
                                <label htmlFor="lastName" className="text-base mb-1 font-semibold">Lastname</label>
                                <input
                                    className="px-3 py-2.5 text-sm border rounded border-gray-400 placeholder-gray-400"
                                    placeholder="Enter Lastname Here..."
                                    id="lastName"
                                    {...register("lastName", { required: "Lastname is required" })}
                                />
                            </div>
                        </div>

                        <div className="my-4 w-full flex flex-col text-gray-800">
                            <label htmlFor="email" className="text-base mb-1 font-semibold">Email</label>
                            <input
                                className="px-3 py-2.5 text-sm border rounded border-gray-400 placeholder-gray-400"
                                placeholder="Enter Email Here..."
                                id="email"
                                {...register("email", { required: "Email is required" })}
                            />
                        </div>

                        <div className="my-4 flex flex-col sm:flex-row gap-x-5 gap-y-4" >
                            <div className="w-full flex flex-col text-gray-800">
                                <label htmlFor="password" className="text-base mb-1 font-semibold">Password</label>
                                <input
                                    className="px-3 py-2.5 text-sm border rounded border-gray-400 placeholder-gray-400"
                                    placeholder="Enter Password Here..."
                                    id="password"
                                    {...register("password", { required: "Password is required" })}
                                />
                            </div>

                            <div className="w-full flex flex-col text-gray-800">
                                <label htmlFor="confirmPassword" className="text-base mb-1 font-semibold">Confirm Password</label>
                                <input
                                    className="px-3 py-2.5 text-sm border rounded border-gray-400 placeholder-gray-400"
                                    placeholder="Enter Confirm Password Here..."
                                    id="confirmPassword"
                                    {...register("confirmPassword", { required: "Confirm Password is required" })}
                                />
                            </div>
                        </div>
                        
                        <div className="mt-6 text-base flex flex-row items-center justify-end">
                            <button type="submit" className="px-6 py-1.5 bg-blue-600 font-semibold text-white">Submit</button>
                        </div>
                    </form>
                </div>

                <div className="floatingTags absolute -left-8 top-[1px] lg:top-[50px] bg-white py-2 px-4 pl-10 flex flex-row items-center font-semibold text-gray-800 shadow-lg rounded-md border border-gray-300"><IoFlowerOutline className="mr-2 text-blue-600"/> <span>Streamlined Workflow</span></div>

                <div className="floatingTags absolute left-0 lg:left-1/2 lg:-translate-x-1/2 bottom-8 bg-white py-2 px-4 pr-6 flex flex-row items-center font-semibold shadow-md border border-gray-300 text-gray-800 rounded-md"><GoWorkflow className="mr-2 text-blue-600"/>Customizable Workflow</div>

                <div className="floatingTags absolute right-0 top-10 bg-white py-2 px-4 pr-6 flex flex-row items-center font-semibold shadow-md border border-gray-300 text-gray-800 rounded-md rounded-tr-none rounded-br-none"><RxActivityLog className="mr-2 text-blue-600"/>Activity Log</div>

                {
                    isLoading && <Spinner/>
                }
            </div>
        </>
    )
}

export default RegisterUser;