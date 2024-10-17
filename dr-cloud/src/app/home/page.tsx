"use client"
import Axios from "axios"
import { CalHolder } from "@/components/child/cal-holder"
import HideableChatbox, { ChatBox } from "@/components/child/chatbox"
import { HomeBento } from "@/components/child/home-bento"
import AnimatedCalendar from "@/components/ui/AnimCalendar"
import ScheduledVisits from "@/components/ui/visits"
import React, { useState, useEffect } from "react"

export default function Home () {
    const [data, setData] = useState();
    const getData = async()=>{
        const response = await Axios.get('http://localhost:5000/getData')
        setData(response.data)
    }

    useEffect(()=>{
        getData()
    }, [])
    return (
        <div className="">
            <div className="fixed bottom-0 w-full">
                < HideableChatbox />
            </div>
            

            <div className="flex flex-row space-x-4 justify center scroll-auto">
                < HomeBento />
                <div className="z-[-1] w-full h-[100] rounded-xl bg-white bg-opacity-80 backdrop-blur-md p-3">
                    <div className="flex flex-row">
                        <div className="max-w-md h-[30.5vw] bg-zinc-800 rounded-lg p-4 text-white w-[100%] right-0"></div>
                        <div className="w-5"></div>
                        <div className="flex flex-col w-full items-end">
                            <div className="max-w-md bg-slate-800 rounded-lg p-4 text-white w-[100%] right-0">{data}</div>

                            <div className="h-3"></div>

                            <div className="w-[445px] h-[400px] flex justify-end">
                                < AnimatedCalendar />
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        </div>
            
    )
}