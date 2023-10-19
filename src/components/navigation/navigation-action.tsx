"use client"

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import ActionTooltip from "../action-tooltip";
import { useModal } from "../../../hooks/use-modal-store";

const NavigationAction = () => {

    const {onOpen} = useModal()

    const createNewServer = () => {
        onOpen("createServer")
    }

    return (
        <div>
            <ActionTooltip side="right" align="center" label="Add a Server">

                <button onClick={createNewServer}  className="group flex items-center">
                    <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] transition-all 
                    group-hover:rounded-[16px] overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Plus className="group-hover:text-white transition text-emerald-500" size={25}  />
                    </div>
                </button>

            </ActionTooltip>
            
        </div>
    );
}
 
export default NavigationAction;