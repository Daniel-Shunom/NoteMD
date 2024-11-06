"use client"

import ProtectedRoute from "@/components/ProtectedRoute"

export default function Profile() {
    return(
        <ProtectedRoute>
            <div>
                hi Doctor
            </div>
        </ProtectedRoute>
        
    )
}