"use client"
import ProtectedRoute from "@/components/ProtectedRoute"
import React from "react"

export default function SettingsPage () {
    return (
        <ProtectedRoute>
            <div>
                Settings
            </div> 
        </ProtectedRoute>
        
    )
}