import { Link } from "react-router-dom";
import hero_bg from "../assets/images/Hero_BG.webp";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoFlowerOutline } from "react-icons/io5";
import { RxActivityLog } from "react-icons/rx";
import { SiOpenhab } from "react-icons/si";     // App LOGO
import { GiSatelliteCommunication } from "react-icons/gi"; //Communication
import { VscLayersActive } from "react-icons/vsc";  // Accountability
import { LuGoal } from "react-icons/lu";    // Goals
import { GoWorkflow } from "react-icons/go";    // Workflow
import { LuListTodo } from "react-icons/lu";
import SEO from "../components/SEO";

const FEATURES = [
    {
        logo: <LuListTodo className="w-11 h-11 text-blue-600"/>,
        heading: "Streamlined Efficiency",
        description: "Enhance Project Management, Utilize Timeline, Board, and List Views for Efficiency."
    },
    {
        logo: <GiSatelliteCommunication className="w-12 h-12 text-blue-600 font-bold"/>,
        heading: "Improved Communication",
        description: "Easily assign tasks and collaborate with your team members."
    },
    {
        logo: <VscLayersActive className="w-12 h-12 text-blue-600"/>,
        heading: "Increased Accountability",
        description: "Effortless Progress Monitoring, Custom Fields and Charts for Personalized Visual Insights."
    },
    {
        logo: <GoWorkflow className="w-12 h-12 text-blue-600"/>,
        heading: "Customizable Workflow",
        description: "Set task priorities and deadlines for a smooth workflow."
    },
    {
        logo: <RxActivityLog className="w-10 h-10 text-blue-600"/>,
        heading: "Activity Log",
        description: "Track all conversations and actions on each task in one place."
    },
    {
        logo: <LuGoal className="w-10 h-10 text-blue-600"/>,
        heading: "Set Goals",
        description: "Set clear goals and track team progress for better productivity."
    }
]

const HomePage = () => {
    return (
        <>
            <SEO
                title="Manage your team’s work, projects, & tasks online"
                description="Make the impossible, possible with FlowMate. The ultimate teamwork project and task management tool. Start up an account in seconds, assign tedious tasks, and collaborate anywhere, even on mobile."
                keywords="task management, productivity, todo list"
            />

            <div className="max-w-[1536px] mx-auto pb-8 sm:pb-20 relative z-1" style={{background: `url(${hero_bg})`, backgroundSize: "100% 100%"}}>
                <header className="w-full mb-12 sm:mb-16">
                    <div style={{backgroundImage: "linear-gradient(90deg,#91eefb,#baec7b)"}} className="welcomeText text-center py-2 font-semibold text-base flex flex-row justify-center items-center mb-4"><span>✨ Welcome to FlowMate — Streamlining Team Collaboration and Boosting Productivity.</span><a href="#features" className="text-blue-700 font-bold flex flex-row items-center ml-2"><span className="mr-2">Explore</span> <FaArrowRightLong/></a></div>

                    <div className="max-w-[1280px] mx-auto flex flex-row items-center justify-between pt-4 sm:pt-0 px-4 sm:px-8 rounded-[2rem]"> 
                        <div className="flex flex-row items-center sm:animate-fade-in-LTR delay-100">
                            <SiOpenhab className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-blue-600"/>
                            <span className="text-2xl sm:text-3xl font-semibold text-gray-800">FlowMate</span>
                        </div>
                        <div className="sm:animate-fade-in-RTL delay-100">
                            <Link to="/sign-in" className="text-lg font-semibold hover:text-blue-600">Sign in</Link>
                            <Link to="/register" className="header_btn text-white bg-blue-600 font-semibold px-3 py-1.5 ml-8 rounded-md">Get Started</Link>
                        </div>
                    </div>
                </header>

                <div className="floatingTags absolute right-0 bg-white py-2 px-4 pr-6 flex flex-row items-center font-semibold shadow-md border border-gray-300 text-gray-800 rounded-md rounded-tr-none rounded-br-none sm:animate-fade-in-RTL"><RxActivityLog className="mr-2 text-blue-600"/>Activity Log</div>
                <div className="floatingTags absolute -left-8 bottom-[20%] bg-white py-2 px-4 pl-10 flex flex-row items-center font-semibold text-gray-800 shadow-lg rounded-md border border-gray-300 sm:animate-fade-in-LTR"><IoFlowerOutline className="mr-2 text-blue-600"/> <span>Streamlined Workflow</span></div>

                <div className="hero_content max-w-[350px] sm:max-w-[550px] md:max-w-[695px] lg:max-w-full mx-auto text-center">
                    <p className="hero_content_heading_1 text-sm sm:text-base xl:text-base leading-6 sm:leading-7 text-blue-700 font-bold uppercase sm:animate-fade-in-LTR">Organize your team and tasks seamlessly with real-time activity tracking.</p>

                    <h1 className="hero_content_heading_2 lg:max-w-[850px] xl:max-w-[975px] mx-auto text-3xl sm:text-5xl md:text-6xl xl:text-7xl leading-[44px] sm:leading-[56px] md:leading-[72px] xl:leading-[85px] font-bold my-6 xl:my-4 text-[#0e1332] sm:animate-fade-in-LTR delay-100">Effortlessly Manage Your <span style={{backgroundImage: "linear-gradient(90deg,#4f57f9,#c9a0ff)", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>Team and Tasks</span> in One Place</h1>

                    <p className="hero_content_heading_3 sm:text-xl md:text-2xl md:w-[500px] mx-auto font-semibold text-gray-500 sm:animate-fade-in-LTR delay-100">Collaborate, Assign, Track, and Communicate with your team to boost productivity.</p>

                    <div className="my-8 xl:mt-12 sm:animate-fade-in-LTR delay-100">
                        <Link to="/register" className="text-white inline-block items-center bg-blue-600 text-base sm:text-xl font-medium rounded-[2rem] py-2 px-4 hover:scale-105 hover:bg-blue-500 transition-transform duration-300"><div className="flex flex-row items-center"><span>Get Started</span> <FaArrowRightLong className="ml-2 sm:ml-3"/></div></Link>
                        <p className="text-gray-500 font-semibold my-2 text-sm">Free forever. No credit card needed.</p>
                    </div>
                    
                </div>
                
            </div>
            {/* Hero section  starts here */}

            <div className="text-center my-10" id="features">
                <div className="text-sm sm:text-base xl:text-base leading-6 sm:leading-7 text-blue-600 font-bold uppercase">FUEL YOUR GROWTH</div>

                <h2 className="max-w-[350px] sm:max-w-[600px] md:max-w-[760px] lg:max-w-[975px] mx-auto text-4xl sm:text-5xl lg:text-6xl leading-[44px] sm:leading-[56px] md:leading-[54px] lg:leading-[66px] font-bold my-2 xl:my-2 text-[#0e1332]"><span style={{backgroundImage: "linear-gradient(90deg,#4f57f9,#c9a0ff)", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>Growth-Ready</span> Business Features</h2>

                <p className="text-[17px] sm:text-xl md:text-base max-w-[350px] sm:max-w-[600px] md:max-w-[760px] lg:max-w-[900px] mx-auto font-semibold text-gray-500">Simplify task management with task lists that clarify priorities, track deadlines, and identify obstacles in each work stage.</p>

                <div className="w-full sm:w-[600px] md:w-[760px] lg:w-[975px] xl:w-[1200px] mx-auto px-4 my-10 py-6 sm:py-10 md:py-6 xl:py-10 flex flex-row justify-center items-center flex-wrap gap-y-6 sm:gap-y-10 md:gap-5 lg:gap-10 xl:gap-8 xl:gap-y-7 rounded-2xl" style={{backgroundImage: "linear-gradient(135deg,#fdf4f4,#dadffe)"}}> 
                    {
                        FEATURES.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center w-[335px] sm:w-[425px] md:w-[350px] lg:w-[400px] xl:w-[360px] p-6 sm:px-2 px-4 bg-white rounded-2xl">
                                <div className="p-5 rounded-[50%] h-14 flex flex-row justify-center items-center">{feature.logo}</div>
                                <h3 className="text-xl sm:text-2xl font-semibold mt-2 sm:mt-6 mb-1 text-gray-700">{feature.heading}</h3>
                                <p className="text-sm sm:text-base text-gray-500 font-medium">{feature.description}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="py-8 my-14 bg-[#F3F3FD]">
                <h2 className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center px-8">
                    <span className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-0 text-center uppercase">Take control of your <span style={{backgroundImage: "linear-gradient(90deg,#4f57f9,#c9a0ff)", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>tasks and team</span> today!</span>
                    <Link to="/register" className="flex flex-row items-center text-base xl:text-xl font-bold text-white bg-blue-600 rounded-lg px-3 py-1.5 xl:px-4 xl:py-2">
                        <span className="mr-2">Get Started</span>
                        <FaArrowRightLong/>
                    </Link>
                </h2>
            </div>

            <footer>
                <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
                    <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-between sm:items-center">
                        <div className="flex flex-row items-center">
                            <SiOpenhab className="w-6 h-6 sm:w-8 sm:h-8 mr-2 text-blue-600"/>
                            <span className="text-2xl lg:text-3xl font-semibold text-gray-800">FlowMate</span>
                        </div>
                        <h2 className="text-xl md:text-2xl lg:text-3xl pt-4 sm:pt-0 text-center font-bold capitalize" style={{backgroundImage: "linear-gradient(90deg,#4f57f9,#c9a0ff)", WebkitTextFillColor: "transparent", backgroundClip: "text"}}>Empowering your team's success, everyday.</h2>
                    </div>

                    <div className="border-b border-gray-300 mx-auto mt-8 mb-2"></div>
                    <div className="text-center text-sm font-medium py-1">Copyright © FlowMate [Preetam Bhardwaj] 2024. All rights reserved.</div>
                </div>
            </footer>


        </>
    )
}

export default HomePage;