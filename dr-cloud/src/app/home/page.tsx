import { CalHolder } from "@/components/child/cal-holder"
import { ChatBox } from "@/components/child/chatbox"
import { HomeBento } from "@/components/child/home-bento"
import React from "react"

export default function Home () {
    return (
        <div >
            <div className="fixed bottom-4 w-[90%] max-w-2xl left-1/2 transform -translate-x-1/2 p-4 bg-white bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg">
                <ChatBox />
            </div>

            <div className="flex flex-row space-x-4 justify center scroll-auto">
                < HomeBento />
                <div className="z-0">
                    < CalHolder />
                    < CalHolder />
                </div>
            </div>
        </div>
            
    )
}