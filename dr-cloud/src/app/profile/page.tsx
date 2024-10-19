import MedsBay from "@/components/child/medbay"
import _Calendar from "@/components/ui/_calendar"
import AnimatedCalendar from "@/components/ui/AnimCalendar"
import React from "react"

export default function ProfilePage () {
    return (
        <div>
           < AnimatedCalendar />
           < MedsBay />
        </div>
    )
}