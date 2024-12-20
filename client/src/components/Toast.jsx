import { useEffect } from "react";
import { MdOutlineCancel, MdOutlineSmsFailed } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { removeToast } from "../utils/toastNotifiactionSlice";

const BGCOLOR = {
    "add" : "bg-green-200 text-green-800",
    "edit" : "bg-yellow-100 text-yellow-600",
    "delete" : "bg-red-200 text-red-600",
    "fail" : "bg-red-200 text-red-600",
    "undo" : "bg-yellow-100 text-yellow-600",
    "success" : "bg-green-200 text-green-800"
}

const Toast = () => {

    const dispatch = useDispatch();
    const toastInfo = useSelector(state => state.toast.value);

    useEffect(() => {
        const timer = setTimeout(() => {
          dispatch(removeToast());
        }, 4000);
    
        return () => clearTimeout(timer);
    }, [dispatch]);

    return (
        <div className={`fixed bottom-4 right-4 flex items-center ${BGCOLOR[toastInfo.type]} font-semibold px-4 py-2 rounded-lg shadow-lg transition-all duration-300 transform text-sm translate-y-0 animate-fade-in-RTL delay-100`}>
            <span className="">{toastInfo.message}</span>
            {/* <button onClick={() => dispatch(removeToast())} className="ml-2 hover:bg-white/20 rounded-full p-1">
                <MdOutlineCancel className="h-4 w-4"/>
            </button> */}
        </div>
    )
}

export default Toast;