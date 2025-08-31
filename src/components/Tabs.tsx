import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Tab Navigation - Mobile First */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white rounded-2xl p-4 shadow-lg border border-gray-200 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`relative flex-1 px-4 py-4 sm:py-5 rounded-xl font-bold text-sm sm:text-base transition-all duration-300 border-2 ${
              tab.disabled
                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                : activeTab === tab.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-xl transform hover:scale-105 hover:shadow-2xl'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transform hover:scale-105 shadow-md hover:shadow-lg'
            }`}
            title={tab.disabled ? 'Primero debes configurar al menos un objetivo' : ''}
          >
            <div className="flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-2">
              <span className={`text-xl sm:text-2xl ${activeTab === tab.id ? 'scale-110' : ''} transition-transform duration-300`}>
                {tab.icon}
              </span>
              <span className="font-bold tracking-wide">
                {tab.label}
              </span>
              {tab.disabled && (
                <span className="absolute top-1 right-1 text-lg opacity-70">
                  🔒
                </span>
              )}
            </div>
            {activeTab === tab.id && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-blue-700/20 pointer-events-none"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper animate-fade-in">
        {activeTabContent}
      </div>

      {/* Info message when other tabs are disabled */}
      {tabs.some(tab => tab.disabled) && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 text-center shadow-lg">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl animate-pulse">🎯</span>
            <h3 className="text-xl font-bold text-blue-900">
              ¡Configura tu primer objetivo!
            </h3>
          </div>
          <p className="text-blue-700 text-base sm:text-lg font-medium leading-relaxed">
            Para desbloquear las demás funciones, necesitas configurar al menos un objetivo financiero.
            <br className="hidden sm:block" />
            <span className="font-semibold">Esto te ayudará a administrar mejor tu dinero con un propósito claro.</span>
          </p>
          <div className="mt-4 flex justify-center">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
              💡 ¡Empieza ahora y toma control de tus finanzas!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
