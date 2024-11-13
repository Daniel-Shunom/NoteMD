"use client";
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/Dashboard/Card";
import { Avatar } from "@/components/ui/Dashboard/Avatar";
import Badge from "@/components/ui/badge";

const DoctorProfile = () => {
  return (
    <Card className="w-full max-w-sm bg-gray-800 text-gray-100 hover:shadow-2xl transition-shadow duration-300 rounded-xl">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 ring-4 ring-indigo-500 flex items-center justify-center bg-gray-700 rounded-full">
            <User className="h-8 w-8 text-indigo-400" />
          </Avatar>
          
          <div className="space-y-1">
            <h3 className="font-bold text-xl">Dr. Sarah Johnson</h3>
            <p className="text-indigo-300 text-sm font-medium">General Practitioner</p>
            <Badge 
              variant="secondary" 
              className="bg-green-600 text-white px-2 py-1 rounded-md text-xs"
            >
              Available Now
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfile;
