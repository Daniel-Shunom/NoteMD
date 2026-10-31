"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link, { LinkProps } from "next/link";
import React, { useState, createContext, useContext, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden lg:flex lg:flex-col bg-neutral-800 dark:bg-neutral-950 w-[300px] flex-shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "80px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setOpen(true);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      const timeout = setTimeout(() => {
        setOpen(false);
      }, 3000); // Hide after 3 seconds of no scroll
      setScrollTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [setOpen, scrollTimeout]);

  return (
    <>
      {/* Fixed Top Bar */}
      <div
        className={cn(
          "h-12 px-4 flex lg:hidden items-center bg-neutral-800 dark:bg-neutral-950 w-full fixed top-0 left-0 z-50",
          className
        )}
        {...props}
      >
        <div className="flex justify-start w-full">
          <motion.div 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          >
            <IconMenu2
              className="text-neutral-200 dark:text-neutral-200 cursor-pointer transition-transform duration-200 ease-in-out"
              size={24}
              onClick={() => setOpen(!open)}
              aria-label="Toggle Sidebar"
            />
          </motion.div>
        </div>
        {/* Sidebar Animation */}
        <AnimatePresence mode="wait">
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
              className={cn(
                "fixed h-full w-[120px] left-0 top-0 bg-neutral-800 dark:bg-neutral-950 flex flex-col z-[100] shadow-lg"
              )}
            >
              {/* Close Icon */}
              <motion.div 
                className="flex items-center justify-center p-4 border-b dark:border-neutral-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                >
                  <IconX
                    size={32}
                    onClick={() => setOpen(false)}
                    className="text-neutral-200 dark:text-neutral-200 cursor-pointer transition-transform duration-200 ease-in-out"
                    aria-label="Close Sidebar"
                  />
                </motion.div>
              </motion.div>
              {/* Sidebar Links */}
              <motion.div 
                className="flex-1 overflow-y-auto py-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {children}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Spacer to prevent content from being hidden behind the fixed top bar */}
      <div className="h-12 lg:hidden" />
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: LinkProps;
}) => {
  const { open, animate } = useSidebar();
  const pathname = usePathname();
  const isActive = link.href ? pathname === link.href : false;

  const activeClass = isActive
    ? "relative text-blue-400 dark:text-blue-300 after:absolute after:inset-0 after:bg-blue-500/10 after:rounded-lg after:-z-10 font-medium"
    : "text-neutral-200 dark:text-neutral-200 hover:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-500/10 dark:hover:bg-blue-900 rounded-lg";

  const iconSize = 32;

  if (link.onClick) {
    return (
      <button
        onClick={link.onClick}
        className={cn(
          `flex items-center justify-start gap-4 py-3 px-3 relative transition-all duration-200 ${activeClass}`,
          className
        )}
      >
        {React.isValidElement(link.icon)
          ? React.cloneElement(link.icon as React.ReactElement, { size: iconSize, className: "text-neutral-200 dark:text-neutral-200" })
          : link.icon}
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-sm whitespace-pre text-neutral-200 dark:text-neutral-200"
        >
          {link.label}
        </motion.span>
      </button>
    );
  } else if (link.href) {
    return (
      <Link
        href={link.href}
        className={cn(
          `flex items-center justify-start gap-4 py-3 px-3 relative transition-all duration-200 ${activeClass}`,
          className
        )}
        {...props}
      >
        {React.isValidElement(link.icon)
          ? React.cloneElement(link.icon as React.ReactElement, { size: iconSize, className: "text-neutral-200 dark:text-neutral-200" })
          : link.icon}
        <motion.span
          animate={{
            display: animate ? (open ? "inline-block" : "none") : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className="text-sm whitespace-pre text-neutral-200 dark:text-neutral-200"
        >
          {link.label}
        </motion.span>
      </Link>
    );
  } else {
    return null;
  }
};