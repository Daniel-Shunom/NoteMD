"use client"
import MedsBay from "@/components/child/medbay"
import ProtectedRoute from "@/components/ProtectedRoute"
import _Calendar from "@/components/ui/_calendar"
import AnimatedCalendar from "@/components/ui/AnimCalendar"
import React from "react"

export default function ProfilePage () {
    return (
        <ProtectedRoute>
            <div>
               < AnimatedCalendar />
               < MedsBay />
            </div>
        </ProtectedRoute>
        
    )
}