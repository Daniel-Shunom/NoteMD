"use client"

import ActionIconsGrid from "@/components/child/ActionsGrid"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function Profile() {
    return(
        <ProtectedRoute>
            <div>
                hi Doctor
                <ActionIconsGrid/>
            </div>
        </ProtectedRoute>
        
    )
}