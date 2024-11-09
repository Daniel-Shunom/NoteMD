// app/SideBarWrapper.tsx

"use client";

import React, { useContext } from 'react';
import { AuthContext } from '../../context/Authcontext';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/Sidebar';
import {
  IconHome,
  IconUserBolt,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";

const SideBarWrapper: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = async () => {
    if (authContext) {
      await authContext.logout();
    }
  };

  const links = [
    { label: "Home", href: "/home", icon: <IconHome /> },
    { label: "Profile", href: "/profile", icon: <IconUserBolt /> },
    { label: "Settings", href: "/Settings", icon: <IconSettings /> },
    { label: "Logout", onClick: handleLogout, icon: <IconLogout /> },
  ];

  return (
    <Sidebar>
      <SidebarBody>
        {links.map((link, index) => (
          <SidebarLink
            key={index}
            link={link}
            // If the link has an onClick handler, prevent default navigation
            //onClick={link.onClick ? (e) => { e.preventDefault(); link.onClick(); } : undefined}
          />
        ))}
      </SidebarBody>
    </Sidebar>
  );
};

export default SideBarWrapper;
