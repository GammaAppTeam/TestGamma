
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileFilterSheetProps {
  tabs: string[];
  activeTab: string;
  myProjectsCount: number;
  onTabSelect: (tab: string) => void;
  projectStatus: 'Open' | 'Closed';
  onStatusChange: (status: 'Open' | 'Closed') => void;
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  tabs,
  activeTab,
  myProjectsCount,
  onTabSelect,
  projectStatus,
  onStatusChange
}) => {
  return (
    <div className="py-4">
      {/* Project Status Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Project Status</h3>
        <div className="space-y-2">
          <button
            onClick={() => onStatusChange('Open')}
            className={`w-full flex items-center justify-between p-4 text-left rounded-lg border transition-colors min-h-[56px] ${
              projectStatus === 'Open'
                ? 'border-[#6264A7] bg-[#6264A7]/5 text-[#6264A7]'
                : 'border-gray-200 hover:bg-gray-50 text-gray-900'
            }`}
          >
            <span className="text-base font-medium">Open Projects 💬</span>
            {projectStatus === 'Open' && (
              <Check className="w-5 h-5 text-[#6264A7]" />
            )}
          </button>
          <button
            onClick={() => onStatusChange('Closed')}
            className={`w-full flex items-center justify-between p-4 text-left rounded-lg border transition-colors min-h-[56px] ${
              projectStatus === 'Closed'
                ? 'border-[#6264A7] bg-[#6264A7]/5 text-[#6264A7]'
                : 'border-gray-200 hover:bg-gray-50 text-gray-900'
            }`}
          >
            <span className="text-base font-medium">Closed Projects ✅</span>
            {projectStatus === 'Closed' && (
              <Check className="w-5 h-5 text-[#6264A7]" />
            )}
          </button>
        </div>
      </div>

      {/* Project Type Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Project Type</h3>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabSelect(tab)}
            className={`w-full flex items-center justify-between p-4 text-left rounded-lg border transition-colors min-h-[56px] ${
              activeTab === tab
                ? 'border-[#6264A7] bg-[#6264A7]/5 text-[#6264A7]'
                : 'border-gray-200 hover:bg-gray-50 text-gray-900'
            }`}
          >
            <span className="text-base font-medium">
              {tab === 'My Projects' ? `My Projects (${myProjectsCount})` : tab}
            </span>
            {activeTab === tab && (
              <Check className="w-5 h-5 text-[#6264A7]" />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={() => {
            onTabSelect('All Formats');
            onStatusChange('Open');
          }}
          className="w-full h-12 text-base"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default MobileFilterSheet;
