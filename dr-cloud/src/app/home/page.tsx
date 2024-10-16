import { CalHolder } from "@/components/child/cal-holder"
import HideableChatbox, { ChatBox } from "@/components/child/chatbox"
import { HomeBento } from "@/components/child/home-bento"
import AnimatedCalendar from "@/components/ui/AnimCalendar"
import ScheduledVisits from "@/components/ui/visits"
import React from "react"

export default function Home () {
    return (
        <div className="space-x-4">
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full">
                < HideableChatbox />
            </div>
            

            <div className="flex flex-row space-x-4 justify center scroll-auto">
                < HomeBento />
                <div className="z-[-1] w-full h-full rounded-xl bg-white bg-opacity-80 backdrop-blur-md p-3">
                    <div className="w-full bg-slate-800 rounded-xl h-full">hi</div>
                    <ScheduledVisits/>
                    <div className="h-3"></div>
                    < AnimatedCalendar />
                </div>
            </div>
        </div>
            
    )
}