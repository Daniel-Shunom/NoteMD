"use client";

import React, { useContext } from 'react';
import { AuthContext } from '../../context/Authcontext';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  IconHome,
  IconUserBolt,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";

const SidebarWrapper: React.FC = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    if (authContext) {
      authContext.logout();
    }
  };

  const links = [
    { label: "Home", href: "/", icon: <IconHome /> },
    { label: "Profile", href: "/profile", icon: <IconUserBolt /> },
    { label: "Settings", href: "/settings", icon: <IconSettings /> },
    { label: "Logout", onClick: handleLogout, icon: <IconLogout /> },
  ];

  return (
    <Sidebar>
      <SidebarBody>
        {links.map((link, index) => (
          <SidebarLink key={index} link={link} />
        ))}
      </SidebarBody>
    </Sidebar>
  );
};

export default SidebarWrapper;
