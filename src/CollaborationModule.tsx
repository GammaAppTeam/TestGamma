import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Plus, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CreateCollaborationModal from "./CreateCollaborationModal";
import CollaborationDetailView from "./CollaborationDetailView";
import UserAvatar from "./UserAvatar";
import MobileFilterSheet from "./MobileFilterSheet";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useCollaborationData } from "@/hooks/useCollaborationData";
import CollaborationFilterTabs from "./CollaborationFilterTabs";
import CollaborationStatusSlider from "./CollaborationStatusSlider";

// Supabase table group_projects schema mapping to frontend Collaboration type.
interface Collaboration {
  id: string; // Add this line
  project_id: string;
  format: string | null;
  subtype: string | null;
  title: string;
  description: string;
  skills: string[] | null;
  topicsOfInterest?: string[] | null;
  date?: string | null;
  time?: string | null;
  timezone?: string | null;
  lumaLink?: string | null;
  frequency?: string | null;
  weekday?: string | null;
  status: "Open" | "Closed" | null;
  creator: string;
  coCreator?: string | null;
  createdAt: number;
  jobFunctionAudience: string[] | null;
  jobChatTeamsUrl: string | null;
}

const formatDisplayMap: { [key: string]: string } = {
  weekly_learning: "Learning Circle",
  hackathon: "Hackathon / Side Project",
  meetup_pod: "Meetup / Pod",
  custom_open_canvas: "Open Format",
  job_function_chat: "Job Function Group",
};
const formatColorMap: { [key: string]: string } = {
  weekly_learning: "bg-[#6264A7] text-white",
  hackathon: "bg-[#2D7AB9] text-white",
  meetup_pod: "bg-[#038387] text-white",
  custom_open_canvas: "bg-[#C239B3] text-white",
  job_function_chat: "bg-[#13A10E] text-white",
};

const formatTabs = [
  "All Formats",
  "Learning Circle",
  "Hackathon / Side Project",
  "Meetup / Pod",
  "Open Format",
  "Job Function Group",
  "My Projects",
];

const CollaborationModule = () => {
  const [projectStatus, setProjectStatus] = React.useState<"Open" | "Closed">("Open");
  const [activeFormatTab, setActiveFormatTab] = React.useState<string>("All Formats");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [selectedCollaboration, setSelectedCollaboration] = React.useState<any>(null);
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);

  // Get current user and data hooks
  const currentUser = useCurrentUser();
  const {
    collaborations,
    isLoading,
    error,
    createCollabMutation,
    updateStatusMutation,
  } = useCollaborationData();

  const queryClient = useQueryClient();

  const handleCreateCollaboration = (newCollaboration: any) => {
    const payload = {
      ...newCollaboration,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
    };
    createCollabMutation.mutate(payload);
    setIsCreateModalOpen(false);
  };

  const handleCollaborationClick = (collab: Collaboration) => setSelectedCollaboration(collab);
  const handleBackToList = () => setSelectedCollaboration(null);

  const handleStatusChange = (project_id: string, status: "Open" | "Closed") => {
    updateStatusMutation.mutate({ project_id, status });
    if (selectedCollaboration?.project_id === project_id) {
      setSelectedCollaboration(prev => prev ? { ...prev, status } : null);
    }
  };

  const handleToggleStatus = (
    e: React.MouseEvent,
    project_id: string,
    currentStatus: "Open" | "Closed"
  ) => {
    e.stopPropagation();
    const newStatus = currentStatus === "Open" ? "Closed" : "Open";
    handleStatusChange(project_id, newStatus);
  };

  // Filtering/tab logic - Fixed ownership check
  const isCurrentUserCreator = (collab: any) => {
    console.log("Checking ownership for:", collab.title, "collab.uid:", collab.uid, "currentUser.id:", currentUser.id);
    return collab.uid === currentUser.id;
  };

  const filteredData = collaborations
    .filter((item) => {
      const displayFormat = formatDisplayMap[item.format ?? ""] || item.format;
      let matchesTab = false;
      const matchesStatus = item.status === projectStatus;

      if (activeFormatTab === "All Formats") {
        matchesTab = true;
      } else if (activeFormatTab === "My Projects") {
        matchesTab = isCurrentUserCreator(item);
        console.log("My Projects filter - item:", item.title, "matches:", matchesTab);
      } else {
        matchesTab = displayFormat === activeFormatTab;
      }

      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesTab && matchesSearch;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const myProjectsCount = collaborations.filter(isCurrentUserCreator).length;
  console.log("Total my projects count:", myProjectsCount);

  if (selectedCollaboration) {
    return (
      <CollaborationDetailView
        collaboration={selectedCollaboration}
        onBack={handleBackToList}
        currentUser={currentUser.name}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 py-4">
            {/* Search Expanded State */}
            {isSearchExpanded ? (
              <div className="flex items-center gap-3 md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchQuery('');
                  }}
                  className="p-2 h-auto rounded-md"
                >
                  ←
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Search collaborations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 text-base border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md"
                    autoFocus
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsSearchExpanded(false);
                    setSearchQuery('');
                  }}
                  className="p-2 h-auto rounded-md"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <>
                {/* Normal Header State */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-4">
                      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                        Community Collaboration
                      </h1>
                      
                      {/* Desktop Search - moved next to title */}
                      <div className="hidden lg:block relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search collaborations..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 w-64 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                      Self-organizing groups to build, learn, and connect.
                    </p>
                  </div>
                  
                  {/* Right side actions with proper spacing */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {/* Mobile Search Icon */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSearchExpanded(true)}
                      className="lg:hidden p-2 h-auto min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md"
                    >
                      <Search className="w-5 h-5" />
                    </Button>
                    
                    {/* Desktop Create Button */}
                    <Button 
                      onClick={() => setIsCreateModalOpen(true)}
                      className="hidden md:flex bg-[#6264A7] hover:bg-[#5a5c9e] text-white mr-2 lg:mr-3 rounded-md"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New
                    </Button>
                    
                    <UserAvatar 
                      name={currentUser.name} 
                      showName={true} 
                      showDropdown={true}
                      className="ml-2 sm:ml-0"
                    />
                  </div>
                </div>

                {/* Mobile Create Button */}
                <div className="mb-4 md:hidden">
                  <Button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full h-12 bg-[#6264A7] hover:bg-[#5a5c9e] text-white text-base rounded-md"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create New
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Filter Dropdown */}
        <div className="bg-white border-b border-gray-200 md:hidden">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-12 flex-1 justify-between text-base rounded-md"
                  >
                    <span>Filter by: {activeFormatTab}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh]">
                  <SheetHeader>
                    <SheetTitle>Filter Collaborations</SheetTitle>
                  </SheetHeader>
                  <MobileFilterSheet
                    tabs={formatTabs}
                    activeTab={activeFormatTab}
                    myProjectsCount={myProjectsCount}
                    onTabSelect={(tab) => {
                      setActiveFormatTab(tab);
                      setIsMobileFilterOpen(false);
                    }}
                    projectStatus={projectStatus}
                    onStatusChange={setProjectStatus}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Desktop Filter Bar - Updated Layout */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 hidden md:block">
          <div className="max-w-7xl mx-auto px-6">
            <div className="py-4 space-y-4">
              {/* Top Row: Search on left, Status Slider on right (smaller) */}
              <div className="flex items-center justify-between">
                {/* Desktop Search - aligned left with top spacing */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search collaborations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-md"
                  />
                </div>
                
                {/* Smaller Status Slider on the right */}
                <div className="flex items-center">
                  <div className="relative inline-flex items-center bg-gray-100 rounded-full p-1 transition-all duration-200 w-56">
                    <div className="flex items-center w-full relative">
                      <div className="absolute inset-0 rounded-full bg-gray-100"></div>
                      <div
                        className={`absolute top-1 bottom-1 rounded-full bg-[#6264A7] shadow-md transition-all duration-200 ease-out ${
                          projectStatus === "Open"
                            ? "left-1 right-[50%]"
                            : "left-[50%] right-1"
                        }`}
                      ></div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setProjectStatus("Open")}
                            className={`relative z-10 flex-1 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                              projectStatus === "Open"
                                ? "text-white"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                            style={{ fontFamily: "Segoe UI, sans-serif" }}
                          >
                            Open Projects 💬
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Currently open for collaboration</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setProjectStatus("Closed")}
                            className={`relative z-10 flex-1 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                              projectStatus === "Closed"
                                ? "text-white"
                                : "text-gray-600 hover:text-gray-800"
                            }`}
                            style={{ fontFamily: "Segoe UI, sans-serif" }}
                          >
                            Closed Projects ✅
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Closed to new members</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-200"></div>

              {/* Bottom Row: Filter Tabs with updated active color to match Teams purple */}
              <div className="flex items-center gap-3 overflow-x-auto">
                {formatTabs.map((tab) => {
                  const isActive = activeFormatTab === tab;
                  return (
                    <Tooltip key={tab}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveFormatTab(tab)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                            isActive
                              ? 'bg-[#6264A7] text-white shadow-md'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          {tab === "My Projects" ? `My Projects (${myProjectsCount})` : tab}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tab === "All Formats" ? "Show all collaboration types" : 
                            tab === "My Projects" ? "Your created collaborations" :
                            tab === "Learning Circle" ? "Weekly learning groups" :
                            tab === "Hackathon / Side Project" ? "Build together" :
                            tab === "Meetup / Pod" ? "Meet in person or virtually" :
                            tab === "Open Format" ? "Custom collaboration styles" :
                            tab === "Job Function Group" ? "Professional networking" : ""}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {/* Mobile: Single Column, Desktop: Multi Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-4">
            {filteredData.map((collaboration) => {
              const displayFormat = formatDisplayMap[collaboration.format] || collaboration.format;
              const formatColor = formatColorMap[collaboration.format] || 'bg-gray-600 text-white';
              const canEditStatus = isCurrentUserCreator(collaboration);
              // Only show tags & Teams URL if format is Job Function Group
              const isJobFunctionGroup = displayFormat === "Job Function Group" || collaboration.format === "job_function_chat";
              return (
                <div
                  key={collaboration.project_id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCollaborationClick(collaboration)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-2">
                      <Badge
                        className={`${formatColor} text-xs font-medium rounded-md`}
                      >
                        {displayFormat}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={collaboration.status === 'Open' ? 'default' : 'secondary'}
                        className={`text-xs rounded-md ${
                          collaboration.status === 'Open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {collaboration.status}
                      </Badge>
                      {/* Only enable toggle for current user */}
                      {canEditStatus && (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Switch
                            checked={collaboration.status === 'Open'}
                            onCheckedChange={() => handleToggleStatus(event as any, collaboration.project_id, collaboration.status)}
                            className={`h-4 w-7 ${
                              collaboration.status === 'Open' 
                                ? 'data-[state=checked]:bg-green-500' 
                                : ''
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg leading-tight" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                    {collaboration.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {collaboration.description}
                  </p>
                  {/* Skills, Topics, and for Job Function Group: Job Function Audience */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {collaboration.skills?.slice(0, 2).map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200 rounded-md"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {collaboration.topicsOfInterest?.slice(0, 2).map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200 rounded-md"
                      >
                        {topic}
                      </Badge>
                    ))}
                    {/* Show audience tags for job function chat */}
                    {isJobFunctionGroup &&
                      Array.isArray(collaboration.jobFunctionAudience) &&
                      collaboration.jobFunctionAudience.slice(0, 3).map((aud) => (
                        <Badge
                          key={aud}
                          variant="outline"
                          className="text-xs bg-purple-50 text-purple-700 border-purple-200"
                        >
                          {aud}
                        </Badge>
                      ))}
                    {/* handle "+ more" for audience if > 3 */}
                    {isJobFunctionGroup &&
                      Array.isArray(collaboration.jobFunctionAudience) &&
                      collaboration.jobFunctionAudience.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          +{collaboration.jobFunctionAudience.length - 3} more
                        </Badge>
                    )}
                    {/* "+ more" for skills+topics */}
                    {!isJobFunctionGroup &&
                      ((collaboration.skills?.length || 0) + (collaboration.topicsOfInterest?.length || 0)) > 4 && (
                        <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                          +{((collaboration.skills?.length || 0) + (collaboration.topicsOfInterest?.length || 0)) - 4} more
                        </Badge>
                    )}
                  </div>
                  {/* Time, Location, Day, Teams URL */}
                  <div className="text-xs text-gray-500 mb-4 space-y-1">
                    {collaboration.date && (
                      <div>
                        📅 {collaboration.date}
                        {collaboration.time && ` at ${collaboration.time}`}
                        {collaboration.timezone && ` (${collaboration.timezone})`}
                      </div>
                    )}
                    {collaboration.time && !collaboration.date && (
                      <div>
                        🕐 {collaboration.time}
                        {collaboration.timezone && ` (${collaboration.timezone})`}
                      </div>
                    )}
                    {collaboration.frequency && (
                      <div>
                        🔄 {collaboration.frequency.charAt(0).toUpperCase() + collaboration.frequency.slice(1)}
                        {collaboration.weekday && ` on ${collaboration.weekday.charAt(0).toUpperCase() + collaboration.weekday.slice(1)}s`}
                      </div>
                    )}
                    {collaboration.weekday && !collaboration.frequency && (
                      <div>📅 {collaboration.weekday.charAt(0).toUpperCase() + collaboration.weekday.slice(1)}s</div>
                    )}
                    {/* Teams URL (for job function chat) */}
                    {isJobFunctionGroup && !!collaboration.jobChatTeamsUrl && (
                      <div>
                        💼{" "}
                        <a
                          href={collaboration.jobChatTeamsUrl}
                          className="text-[#2D7AB9] underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Teams Link
                        </a>
                      </div>
                    )}
                  </div>
                  {/* Creators etc */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-h-[44px]">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <UserAvatar name={collaboration.creator} size="sm" />
                          <div className="text-xs text-gray-500">
                            {isCurrentUserCreator(collaboration) ? (
                              <span className="text-[#6264A7]">{collaboration.creator} (You)</span>
                            ) : (
                              <span>{collaboration.creator}</span>
                            )}
                          </div>
                        </div>
                        {collaboration.coCreator && (
                          <div className="flex items-center gap-2">
                            <UserAvatar name={collaboration.coCreator} size="sm" />
                            <span className="text-xs text-gray-500">{collaboration.coCreator}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#6264A7] border-[#6264A7] hover:bg-[#6264A7] hover:text-white md:min-w-auto min-w-[120px] min-h-[44px] md:min-h-auto rounded-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCollaborationClick(collaboration);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                No {projectStatus.toLowerCase()} collaborations found matching your criteria.
              </p>
            </div>
          )}
        </div>

        {/* Create Collaboration Modal - Remove currentUserId prop */}
        <CreateCollaborationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateCollaboration}
        />
      </div>
    </TooltipProvider>
  );
};

export default CollaborationModule;
