
import React from 'react';

interface TabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabChange: React.Dispatch<React.SetStateAction<T>>;
}

const Tabs = <T extends string>({ tabs, activeTab, onTabChange }: TabsProps<T>) => {
  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`${
              tab === activeTab
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-3 border-b-2 font-semibold text-base md:text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-t-md`}
            aria-current={tab === activeTab ? 'page' : undefined}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;