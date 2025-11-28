'use client';

interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tabs({ activeTab, onTabChange }: TabsProps) {
  const tabs = ['all', 'coworking', 'meeting room', 'event venue', 'conference hall'];

  return (
    <div className="bg-blue-600 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center space-x-2 md:space-x-4">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-white text-blue-600'
                  : 'text-white hover:bg-blue-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}