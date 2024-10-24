// Tabs.tsx
import React, {
  useState,
  ReactNode,
  useEffect,
  useCallback,
  KeyboardEvent,
} from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import classNames from 'classnames';

/**
 * Interface for individual Tab
 */
export interface Tab { // Exported interface
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Props for the Tabs component
 */
interface TabsProps {
  tabs: Tab[];
  defaultActiveTabId?: string;
  activeTabId?: string; // For controlled mode
  onTabChange?: (id: string) => void;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  tabIndicatorClassName?: string;
  tabPanelClassName?: string;
  animation?: Partial<MotionProps>; // Updated Typing
}

/**
 * Tabs Component with Glassmorphism and Flexible Content Area
 */
const Tabs: React.FC<TabsProps> = React.memo(
  ({
    tabs,
    defaultActiveTabId,
    activeTabId,
    onTabChange,
    className,
    tabListClassName,
    tabClassName,
    activeTabClassName,
    tabIndicatorClassName,
    tabPanelClassName,
    animation = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.3 },
    },
  }) => {
    const isControlled =
      activeTabId !== undefined && onTabChange !== undefined;

    const [internalActiveTab, setInternalActiveTab] = useState<string>(
      defaultActiveTabId || (tabs.length > 0 ? tabs[0].id : '')
    );

    const currentActiveTab = isControlled ? activeTabId : internalActiveTab;

    const handleTabClick = useCallback(
      (id: string) => {
        if (isControlled) {
          onTabChange && onTabChange(id);
        } else {
          setInternalActiveTab(id);
        }
      },
      [isControlled, onTabChange]
    );

    useEffect(() => {
      if (!isControlled && defaultActiveTabId) {
        setInternalActiveTab(defaultActiveTabId);
      }
    }, [defaultActiveTabId, isControlled]);

    /**
     * Handle keyboard navigation for accessibility
     */
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          const nextIndex = (index + 1) % tabs.length;
          handleTabClick(tabs[nextIndex].id);
          const nextTab = document.getElementById(`tab-${tabs[nextIndex].id}`);
          nextTab?.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const prevIndex = (index - 1 + tabs.length) % tabs.length;
          handleTabClick(tabs[prevIndex].id);
          const prevTab = document.getElementById(`tab-${tabs[prevIndex].id}`);
          prevTab?.focus();
        }
      },
      [handleTabClick, tabs]
    );

    return (
      <div className={classNames('w-full h-full flex flex-col', className)}>
        {/* Tab List with Glassmorphism */}
        <div
          className={classNames(
            'flex space-x-2 p-1 rounded-full bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-30 shadow-lg flex-none',
            tabListClassName
          )}
          role="tablist"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={classNames(
                'relative z-10 px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
                tabClassName,
                {
                  'text-white': currentActiveTab === tab.id, // Active text color
                  'text-gray-500 hover:text-gray-700':
                    currentActiveTab !== tab.id,
                },
                currentActiveTab === tab.id && activeTabClassName
              )}
              role="tab"
              aria-selected={currentActiveTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={currentActiveTab === tab.id ? 0 : -1}
            >
              {tab.label}
              {/* Active Tab Indicator with Glassmorphism */}
              <AnimatePresence>
                {currentActiveTab === tab.id && (
                  <motion.span
                    className={classNames(
                      'absolute inset-1 rounded-full bg-blue-600 bg-opacity-50 shadow-inner',
                      tabIndicatorClassName
                    )}
                    layoutId="active-pill"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>

        {/* Tab Panels with Glassmorphism */}
        <div className="relative mt-6 flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {tabs.map(
              (tab) =>
                currentActiveTab === tab.id && (
                  <motion.div
                    key={tab.id}
                    id={`tabpanel-${tab.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${tab.id}`}
                    className={classNames(
                      'w-full p-2 rounded-lg bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 shadow-inner',
                      tabPanelClassName
                    )}
                    {...animation} // Spread Animation Props
                  >
                    {tab.content}
                  </motion.div>
                )
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

// Adding a display name for easier debugging
Tabs.displayName = 'Tabs';

export default Tabs;
