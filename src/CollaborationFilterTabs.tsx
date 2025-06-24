
import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  tabs: string[];
  activeTab: string;
  myProjectsCount: number;
  onTabSelect: (tab: string) => void;
}

const tooltipTexts: Record<string, string> = {
  "All Formats": "Show all collaboration types",
  "My Projects": "Your created collaborations",
  "Learning Circle": "Weekly learning groups",
  "Hackathon / Side Project": "Build together",
  "Meetup / Pod": "Meet in person or virtually",
  "Open Format": "Custom collaboration styles",
  "Job Function Group": "Professional networking",
};

export default function CollaborationFilterTabs({
  tabs,
  activeTab,
  myProjectsCount,
  onTabSelect,
}: Props) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <Tooltip key={tab}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTabSelect(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gray-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                {tab === "My Projects" ? `My Projects (${myProjectsCount})` : tab}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltipTexts[tab]}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
