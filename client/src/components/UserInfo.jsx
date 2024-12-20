import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { BGS, OUTLINE } from "../utils";
import clsx from "clsx";

const UserInfo = ({user, index}) => {
    if(!user){
        return <div>Loading...</div>
    }

    return(
        <Popover className="-ml-1.5 first:ml-0">
            <PopoverButton className={clsx("w-7 h-7 p-4 rounded-full flex items-center justify-center uppercase text-white", OUTLINE[index%4], BGS[index%4])}>{user?.memberId?.firstName?.[0] || ''}{user?.memberId?.lastName?.[0] || ''}</PopoverButton>
            <PopoverPanel anchor="bottom" className={`bg-white flex flex-grow items-center px-4 py-6 mt-2 shadow-md`}>
                <div className={clsx("text-4xl w-16 h-16 text-white flex flex-row justify-center items-center rounded-[50%] mx-4", BGS[index%4])}>
                    <span>{user?.memberId?.firstName?.[0] || ''}{user?.memberId?.lastName?.[0] || ''}</span>
                </div>
                <div>
                    <p className="text-xl text-left font-medium">{user?.memberId?.firstName} {user?.memberId?.lastName}</p>
                    <p className="text-base text-left text-gray-600 mb-1">{user?.role}</p>
                    <p className="text-sm text-left text-blue-600">{user?.email}</p>
                </div>
            </PopoverPanel>
        </Popover>
    )
}

export default UserInfo;