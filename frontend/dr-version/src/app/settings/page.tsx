"use client"

import ProtectedRoute from "@/components/ProtectedRoute"

export default function Settings(){
    return(
        <ProtectedRoute>
            <div>
                Settings Dr.
            </div>
        </ProtectedRoute>
    )
}