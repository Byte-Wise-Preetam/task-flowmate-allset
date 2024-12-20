import { useSelector } from "react-redux";
import TaskCard from "./TaskCard";

const BoardView = ({tasks}) => {
    const loggedinUser = useSelector((state) => state.loginUser.user);

    if(!tasks){
        return <div>Loading...</div>
    }

    if(tasks.length === 0){
        return <div>No Tasks Available</div>
    }

    return(
        <div className="w-full flex flex-row flex-wrap mx-auto gap-x-3 gap-y-6 sm:gap-y-3 lg:gap-y-8 xl:gap-y-6 lg:gap-x-6">
            {
                tasks.map((task) => (
                    <div className="w-[calc(100%)] sm:w-[calc(50%-6px)] md:w-[calc(33.33%-8px)] lg:w-[calc(50%-12px)] xl:w-[calc(33.33%-16px)]" key={task?._id}>
                        <TaskCard task={task} isUserTaskAdmin={loggedinUser._id === task.taskAdmin._id}/>
                    </div>
                ))
            }
        </div>
    )
}

export default BoardView;