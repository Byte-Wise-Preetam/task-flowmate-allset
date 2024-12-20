import { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { IoMdSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { PRIORITYBGSTYLES, STATUSSTYLES } from "../utils";

const SearchTasksComponent = () => {
    const [searchTerm, setSearchTerm] = useState("");  
    const [searchResults, setSearchResults] = useState([]);
    const tasksStored = useSelector(state => state.tasks.value); 
    const searchRef = useRef(null);  

    // Function to filter tasks based on the search term
    const searchTasks = useCallback((tasks) => {
        return tasks.filter(task => 
            task.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.subTasks.some(subTask => subTask.title.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [searchTerm]);

    const handleClickOutside = useCallback((event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setSearchTerm("");  // Reset searchTerm when clicked outside
        }
    }, []);

    useEffect(() => {
        if (searchTerm === "") {
            setSearchResults([]);  // Clear search results when searchTerm is empty
            return;
        }

        const filteredTasks = searchTasks(tasksStored);
        setSearchResults(filteredTasks);
    }, [searchTerm, tasksStored, searchTasks]);  // Update whenever searchTerm or tasksStored change

    // Function to detect clicks outside the search component

    useEffect(() => {
        // Add event listener when component mounts
        document.addEventListener("mousedown", handleClickOutside);
        
        // Remove event listener when component unmounts
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div ref={searchRef} className="relative">
            <div className="w-[175px] sm:w-[300px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
                <IoMdSearch className="w-5 h-5 text-gray-500 font-bold"/>
                <input
                    className="flex-1 outline-none bg-transparent font-medium placeholder:text-gray-500 text-gray-800"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                />
            </div>
            
            {/* Render search results */}
            <div className="absolute w-full top-[110%] flex flex-col shadow-lg bg-white px-2">
                {searchResults.length > 0 ? (
                    searchResults.map((task) => (
                        <Link to={`/dashboard/task-info/${task._id}`} className="w-full py-2 px-1 border-b border-gray-300 last:border-0 flex flex-row items-center gap-x-2" key={task._id}>
                            <div className={`${ STATUSSTYLES[task.status]} w-3 h-3 rounded-[50%]`}></div>
                            <span className="line-clamp-1">{task.title}</span>
                            {/* Add more details as needed */}
                        </Link>
                    ))
                ) : (
                    searchTerm && <p className="py-2 px-1">No tasks found for "{searchTerm}".</p>
                )}
            </div>
        </div>
    );
};

export default SearchTasksComponent;
