import { CalHolder } from "@/components/child/cal-holder"
import { ChatBox } from "@/components/child/chatbox"
import { HomeBento } from "@/components/child/home-bento"
import React from "react"

export default function Home () {
    return (
        <div >
            <div className="fixed bottom-4 w-[90%] max-w-2xl left-1/2 transform -translate-x-1/2 p-4">
  <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl shadow-lg p-4 max-h-32 overflow-y-auto">
    <ChatBox />
  </div>
</div>

            <div className="flex flex-row space-x-4 justify center scroll-auto">
                < HomeBento />
                <div>
                    < CalHolder />
                    < CalHolder />
                </div>
            </div>
        </div>
            
    )
}