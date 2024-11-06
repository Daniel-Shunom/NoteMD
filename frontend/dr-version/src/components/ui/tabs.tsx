// Tabs.tsx
import React, {
  useState,
  ReactNode,
  useEffect,
  useCallback,
  KeyboardEvent,
  useRef,
  useMemo,
} from 'react';
import { motion, AnimatePresence, MotionProps } from 'framer-motion';
import classNames from 'classnames';

/**
 * Interface for individual Tab
 */
export interface Tab {
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
  animation?: Partial<MotionProps>;
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
     * Create refs for each tab button
     */
    const tabRefs = useMemo(
      () => tabs.map(() => React.createRef<HTMLButtonElement>()),
      [tabs]
    );

    /**
     * Handle keyboard navigation for accessibility
     */
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
        let newIndex = index;
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          newIndex = (index + 1) % tabs.length;
          handleTabClick(tabs[newIndex].id);
          tabRefs[newIndex].current?.focus();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          newIndex = (index - 1 + tabs.length) % tabs.length;
          handleTabClick(tabs[newIndex].id);
          tabRefs[newIndex].current?.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          newIndex = 0;
          handleTabClick(tabs[newIndex].id);
          tabRefs[newIndex].current?.focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          newIndex = tabs.length - 1;
          handleTabClick(tabs[newIndex].id);
          tabRefs[newIndex].current?.focus();
        }
      },
      [handleTabClick, tabs, tabRefs]
    );

    if (tabs.length === 0) {
      return null; // Or render a fallback UI
    }

    return (
      <div className={classNames('w-full h-full flex flex-col', className)}>
        {/* Tab List with Glassmorphism and Responsive Scrolling */}
        <div
          className={classNames(
            'flex space-x-2 p-1 sm:p-2 rounded-full bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 shadow-md flex-none overflow-x-auto no-scrollbar',
            tabListClassName
          )}
          role="tablist"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={tabRefs[index]}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={classNames(
                'relative z-10 px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full',
                tabClassName,
                {
                  'text-white': currentActiveTab === tab.id, // Active text color
                  'text-gray-300 hover:text-gray-500':
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
                      'absolute inset-0 rounded-full bg-blue-600 bg-opacity-50 shadow-inner',
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

        <div className='h-3'></div>

        {/* Tab Panels with Glassmorphism */}
        <div className="relative flex-1 overflow-hidden">
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
                      'w-full p-4 sm:p-6 rounded-lg bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 shadow-inner flex items-end',
                      tabPanelClassName
                    )}
                    {...animation} // Spread Animation Props
                  >
                    <div className="w-full h-full overflow-auto">
                      {tab.content}
                    </div>
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
