import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ActionTooltiprops {
    label: string
    children: React.ReactNode
    side?: "top" | "right" | "left" | "bottom"
    align?: "start" | "center" | "end" 
}

const ActionTooltip = ({label,children,side,align} : ActionTooltiprops) => {
    return ( 
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align} >
                        <p className="font-semibold text-sm capitalize">
                            {label.toLowerCase()}
                        </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
 
export default ActionTooltip;