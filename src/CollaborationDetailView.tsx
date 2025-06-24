import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, MessageCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UserAvatar from './UserAvatar';

interface Collaboration {
  id: string;
  format: string;
  subtype: string;
  title: string;
  description: string;
  skills: string[];
  date?: string;
  time?: string;
  timezone?: string;
  location?: string;
  frequency?: string;
  status: 'Open' | 'Closed';
  creator: string;
  coCreator?: string;
  groupSize?: string;
  effort?: string;
  startDate?: string;
  teamsLink?: string;
  collaborationStyle?: string;
  whoIsThisFor?: string[];
  topicsOfInterest?: string[];
  meetingDate?: string;
  meetingTime?: string;
  meetingDay?: string;
  learningTime?: string;
  learningTimezone?: string;
  lumaLink?: string;
  jobChatTeamsUrl?: string;
}

interface CollaborationDetailViewProps {
  collaboration: Collaboration;
  onBack: () => void;
  currentUser: string;
  onStatusChange: (id: string, status: 'Open' | 'Closed') => void;
}

const CollaborationDetailView: React.FC<CollaborationDetailViewProps> = ({ 
  collaboration, 
  onBack,
  currentUser,
  onStatusChange
}) => {
  const [showCloseConfirmation, setShowCloseConfirmation] = useState(false);
  
  const creationDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Helper function to safely format any value for display
  const formatDisplayValue = (value: any): string => {
    if (!value) return '';
    
    // If it's already a string or number, convert to string
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    
    // If it's a native Date object, format it
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    // Handle complex date objects from form submission
    if (value && typeof value === 'object') {
      // Handle date-fns or other date objects with nested structure
      if (value._type === 'Date' && value.value) {
        if (value.value.local) {
          // Parse the local date string and format it
          return new Date(value.value.local).toLocaleDateString();
        }
        if (value.value.iso) {
          return new Date(value.value.iso).toLocaleDateString();
        }
        if (typeof value.value === 'number') {
          return new Date(value.value).toLocaleDateString();
        }
      }
      
      // Handle other date object formats
      if (value.value && value.value.local) {
        return new Date(value.value.local).toLocaleDateString();
      }
      if (value.value && value.value.iso) {
        return new Date(value.value.iso).toLocaleDateString();
      }
      if (value.iso) {
        return new Date(value.iso).toLocaleDateString();
      }
      if (value.value && typeof value.value === 'number') {
        return new Date(value.value).toLocaleDateString();
      }
      
      // Handle objects with toString method
      if (value.toString && typeof value.toString === 'function') {
        const stringValue = value.toString();
        // Avoid rendering [object Object]
        if (stringValue !== '[object Object]') {
          return stringValue;
        }
      }
    }
    
    // Fallback - convert to string but avoid [object Object]
    const stringValue = String(value);
    return stringValue === '[object Object]' ? '' : stringValue;
  };

  const formatDisplayMap: { [key: string]: string } = {
    'weekly_learning': 'Weekly Learning Circle',
    'hackathon': 'Hackathon / Side Project',
    'meetup_pod': 'Meetup / Pod',
    'custom_open_canvas': 'Custom',
    'job_function_chat': 'Job Function Group'
  };

  const formatColorMap: { [key: string]: string } = {
    'weekly_learning': 'bg-[#6264A7] text-white',
    'hackathon': 'bg-[#2D7AB9] text-white',
    'meetup_pod': 'bg-[#038387] text-white',
    'custom_open_canvas': 'bg-[#C239B3] text-white',
    'job_function_chat': 'bg-[#13A10E] text-white'
  };

  const handleContactCreator = () => {
    window.open('https://teams.microsoft.com/l/chat/0/0?users=shivangi.rajoria@gmail.com', '_blank');
  };

  const handleContactCoCreator = () => {
    window.open('https://teams.microsoft.com/l/chat/0/0?users=shivangi.rajoria@gmail.com', '_blank');
  };

  const handleCloseProject = () => {
    setShowCloseConfirmation(true);
  };

  const confirmCloseProject = () => {
    onStatusChange(collaboration.id, 'Closed');
    setShowCloseConfirmation(false);
  };

  const displayFormat = formatDisplayMap[collaboration.format] || collaboration.format;
  const formatColor = formatColorMap[collaboration.format] || 'bg-gray-600 text-white';
  const isCreator = collaboration.creator === currentUser;
  const shouldShowContactButton = !isCreator && collaboration.status === 'Open';

  // Teams icon component with proper URL
  const TeamsIcon = () => (
    <img 
      src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg" 
      alt="Microsoft Teams"
      className="w-5 h-5"
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Back Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 sm:px-6 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#6264A7] hover:text-[#5a5c9e] transition-colors min-h-[44px] rounded-md px-3 py-2"
            style={{ fontFamily: 'Segoe UI, sans-serif' }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">Back to {displayFormat}</span>
          </button>
        </div>
      </div>

      {/* Mobile-First Header */}
      <div className="bg-gradient-to-r from-[#6264A7] to-white">
        <div className="px-4 sm:px-6 py-6 sm:py-8">
          {/* Breadcrumb - Hidden on Mobile */}
          <div className="text-sm text-white/80 mb-4 hidden sm:block" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            {displayFormat} &gt; {collaboration.title}
          </div>
          
          {/* Title and Tags */}
          <div className="mb-4 sm:mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-tight" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                {collaboration.title}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className={`${formatColor} font-medium text-sm rounded-md`}>
                {displayFormat}
              </Badge>
              <Badge
                variant={collaboration.status === 'Open' ? 'default' : 'secondary'}
                className={collaboration.status === 'Open' 
                  ? 'bg-green-500 text-white text-sm rounded-md' 
                  : 'bg-white/20 text-white text-sm rounded-md'
                }
              >
                {collaboration.status}
              </Badge>
            </div>
          </div>

          {/* Mobile Action Buttons - Show based on Lu.ma link presence */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-2">
            {collaboration.lumaLink && collaboration.status === 'Open' ? (
              <Button 
                onClick={() => window.open(collaboration.lumaLink, '_blank')}
                className="w-full sm:w-auto bg-white text-[#6264A7] hover:bg-gray-50 flex items-center justify-center gap-2 h-12 text-base rounded-md"
              >
                📅 RSVP on Lu.ma
              </Button>
            ) : (
              <>
                {shouldShowContactButton && (
                  <Button 
                    onClick={handleContactCreator}
                    className="w-full sm:w-auto bg-[#6264A7] text-white hover:bg-[#5a5c9e] flex items-center justify-center gap-3 h-14 text-sm font-semibold shadow-md rounded-md"
                    style={{ fontFamily: 'Segoe UI, sans-serif' }}
                  >
                    <TeamsIcon />
                    Contact Creator on Teams
                  </Button>
                )}
              </>
            )}
            {isCreator && collaboration.status === 'Open' && (
              <Button 
                onClick={handleCloseProject}
                variant="outline"
                className="w-full sm:w-auto bg-white/10 text-white border-white/30 hover:bg-white/20 h-12 text-base rounded-md"
              >
                Close Project
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Area - Mobile Optimized */}
      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Single Column Layout on Mobile */}
          <div className="space-y-6">
            {/* Description Section */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  <Users className="w-5 h-5 text-[#6264A7]" />
                  About This Collaboration
                </h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-6" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  {collaboration.description}
                </p>

                {/* Updated Open Format Inspiration Box */}
                {collaboration.format === 'custom_open_canvas' && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Lightbulb className="w-6 h-6 text-purple-600 mt-1" />
                      <h3 className="text-lg font-semibold text-purple-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                        💡 Need ideas? Try one of these Open Format styles:
                      </h3>
                    </div>
                    <div className="space-y-6 text-sm text-purple-800">
                      <div>
                        <div className="font-semibold mb-2 text-purple-900">🔁 Skill Swap Circles</div>
                        <div className="text-purple-700 italic mb-2">Learn from peers, teach what you know.</div>
                        <ul className="space-y-1 ml-4 text-purple-700">
                          <li>• Design ↔ Dev: Figma for Git? Make it a trade.</li>
                          <li>• Excel Masters & PMs: Shortcuts for planning strategies.</li>
                          <li>• SEO & Content: Writers + marketers swap skills.</li>
                          <li>• Language Exchange: Practice with a native buddy.</li>
                          <li>• Public Speaking Circle: Boost your presence, together.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="font-semibold mb-2 text-purple-900">💼 Career Growth Pods</div>
                        <div className="text-purple-700 italic mb-2">Support each other with honest feedback and shared goals.</div>
                        <ul className="space-y-1 ml-4 text-purple-700">
                          <li>• Resume Review Squad: Exchange honest, fast feedback.</li>
                          <li>• Mock Interview Exchange: Practice and coach each other.</li>
                          <li>• LinkedIn & Networking Tips: Learn what works, share your own.</li>
                          <li>• Portfolio Review Pod: Get eyes on your work before the world does.</li>
                          <li>• Career Support Circle: Your personal board of directors.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="font-semibold mb-2 text-purple-900">🤖 AI + Creativity Labs</div>
                        <div className="text-purple-700 italic mb-2">Explore, build, or debate with AI together.</div>
                        <ul className="space-y-1 ml-4 text-purple-700">
                          <li>• Creative GPT Storytelling Lab: Co-create fiction or prompts.</li>
                          <li>• AI-Powered Habit Trackers: Build accountability with GPTs.</li>
                          <li>• Debate Club: Should GPTs replace resumes?</li>
                          <li>• GPT Games: Test your prompt skills in fun challenges.</li>
                          <li>• AI for Community Organising: Use GenAI to drive real change.</li>
                          <li>• Mindfulness + AI: Reflect, share, and grow with tech.</li>
                          <li>• Teaching Kids GenAI: Share tips, demos, and lesson ideas.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="font-semibold mb-2 text-purple-900">🎨 Passion Projects & Creativity Pods</div>
                        <div className="text-purple-700 italic mb-2">Mix skills, make things, and spark ideas.</div>
                        <ul className="space-y-1 ml-4 text-purple-700">
                          <li>• Creative Writing & Editing Buddies: Polish stories or blog posts.</li>
                          <li>• Demo Jam: Show what you're building, get instant feedback.</li>
                          <li>• Growth Mindset Group: Swap strategies and micro-habits.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Job Function Chat Teams Link */}
                {collaboration.format === 'job_function_chat' && collaboration.jobChatTeamsUrl && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 text-blue-600 mt-0.5">
                        <TeamsIcon />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Join Teams Chat</h3>
                        <p className="text-blue-800 text-sm mb-3">
                          Connect with other professionals in this job function through our dedicated Teams channel.
                        </p>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                          onClick={() => window.open(collaboration.jobChatTeamsUrl, '_blank')}
                        >
                          💬 Join Teams Chat
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lu.ma Instructions for Meetups */}
                {collaboration.format === 'meetup_pod' && collaboration.lumaLink && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">RSVP Required</h3>
                        <p className="text-blue-800 text-sm mb-3">
                          This meetup is hosted on Lu.ma. Please RSVP to secure your spot and receive event updates.
                        </p>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                          onClick={() => window.open(collaboration.lumaLink, '_blank')}
                        >
                          📅 RSVP on Lu.ma
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Section */}
            {collaboration.skills && collaboration.skills.length > 0 && (
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                    Skills & Technologies
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {collaboration.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-sm rounded-md"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Details Panel */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  Details
                </h3>
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                    <div className={`w-3 h-3 rounded-full ${collaboration.status === 'Open' ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span>Status: {collaboration.status}</span>
                  </div>

                  {/* Group Size - Show for all relevant project types */}
                  {collaboration.groupSize && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <Users className="w-5 h-5 text-[#6264A7]" />
                      <span>Group Size: {formatDisplayValue(collaboration.groupSize)}</span>
                    </div>
                  )}

                  {/* Estimated Effort - Show prominently for hackathons */}
                  {collaboration.format === 'hackathon' && collaboration.effort && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <Clock className="w-5 h-5 text-[#6264A7]" />
                      <span>Estimated Effort: {formatDisplayValue(collaboration.effort)}</span>
                    </div>
                  )}

                  {/* Start Date - Display exactly as stored */}
                  {collaboration.startDate && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <Calendar className="w-5 h-5 text-[#6264A7]" />
                      <span>Start Date: {collaboration.startDate}</span>
                    </div>
                  )}

                  {/* Meeting Day and Time (for weekly learning) */}
                  {(collaboration.meetingDay || collaboration.learningTime) && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <Calendar className="w-5 h-5 text-[#6264A7]" />
                      <span>
                        {collaboration.meetingDay && collaboration.learningTime 
                          ? `${formatDisplayValue(collaboration.meetingDay)}s at ${formatDisplayValue(collaboration.learningTime)}`
                          : formatDisplayValue(collaboration.meetingDay) || formatDisplayValue(collaboration.learningTime)
                        }
                        {collaboration.learningTimezone && ` (${formatDisplayValue(collaboration.learningTimezone)})`}
                      </span>
                    </div>
                  )}

                  {/* Meeting Date and Time (for meetups) */}
                  {(collaboration.meetingDate || collaboration.meetingTime) && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <Calendar className="w-5 h-5 text-[#6264A7]" />
                      <span>
                        {collaboration.meetingDate && collaboration.meetingTime 
                          ? `${formatDisplayValue(collaboration.meetingDate)} at ${formatDisplayValue(collaboration.meetingTime)}`
                          : formatDisplayValue(collaboration.meetingDate) || formatDisplayValue(collaboration.meetingTime)
                        }
                        {collaboration.timezone && ` (${formatDisplayValue(collaboration.timezone)})`}
                      </span>
                    </div>
                  )}

                  {/* Regular Date and Time */}
                  {(collaboration.date || collaboration.time) && !(collaboration.meetingDate || collaboration.meetingTime) && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <Calendar className="w-5 h-5 text-[#6264A7]" />
                      <span>
                        {collaboration.date && collaboration.time 
                          ? `${formatDisplayValue(collaboration.date)} at ${formatDisplayValue(collaboration.time)}`
                          : formatDisplayValue(collaboration.date) || formatDisplayValue(collaboration.time)
                        }
                        {collaboration.timezone && ` (${formatDisplayValue(collaboration.timezone)})`}
                      </span>
                    </div>
                  )}

                  {/* Location */}
                  {collaboration.location && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <MapPin className="w-5 h-5 text-[#6264A7]" />
                      <span>{formatDisplayValue(collaboration.location)}</span>
                    </div>
                  )}

                  {/* Collaboration Style */}
                  {collaboration.collaborationStyle && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <Clock className="w-5 h-5 text-[#6264A7]" />
                      <span>Style: {formatDisplayValue(collaboration.collaborationStyle)}</span>
                    </div>
                  )}

                  {/* Teams Link */}
                  {collaboration.teamsLink && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <div className="w-5 h-5 text-[#6264A7]">
                        <TeamsIcon />
                      </div>
                      <a 
                        href={collaboration.teamsLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#6264A7] hover:underline"
                      >
                        Teams Chat Link
                      </a>
                    </div>
                  )}

                  {/* Who is this for */}
                  {collaboration.whoIsThisFor && collaboration.whoIsThisFor.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm sm:text-base font-medium text-gray-700">Who is this for:</div>
                      <div className="flex flex-wrap gap-2">
                        {collaboration.whoIsThisFor.map((item) => (
                          <Badge key={item} variant="outline" className="text-sm">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topics of Interest */}
                  {collaboration.topicsOfInterest && collaboration.topicsOfInterest.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm sm:text-base font-medium text-gray-700">Topics of Interest:</div>
                      <div className="flex flex-wrap gap-2">
                        {collaboration.topicsOfInterest.map((topic) => (
                          <Badge key={topic} variant="outline" className="text-sm">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Frequency */}
                  {collaboration.frequency && (
                    <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600 min-h-[44px]">
                      <Clock className="w-5 h-5 text-[#6264A7]" />
                      <span>Frequency: {formatDisplayValue(collaboration.frequency)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Creator Profile */}
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                  Created by
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <UserAvatar name={collaboration.creator} size="lg" />
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                      {collaboration.creator}
                      {isCreator && <span className="text-sm text-gray-500">(You)</span>}
                    </div>
                    <div className="text-sm text-gray-500">
                      Created on {creationDate}
                    </div>
                  </div>
                </div>

                {/* Co-Creator Display */}
                {collaboration.coCreator && (
                  <div className="flex items-center gap-3 mb-4">
                    <UserAvatar name={collaboration.coCreator} size="lg" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm sm:text-base" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                        {collaboration.coCreator}
                        <span className="text-sm text-gray-500 ml-2">(Co-Creator)</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Show appropriate buttons based on Lu.ma link and user role */}
                  {collaboration.lumaLink && collaboration.status === 'Open' ? (
                    <Button 
                      onClick={() => window.open(collaboration.lumaLink, '_blank')}
                      className="w-full bg-[#6264A7] hover:bg-[#5a5c9e] text-white flex items-center justify-center gap-2 h-12 text-base rounded-md"
                    >
                      📅 RSVP on Lu.ma
                    </Button>
                  ) : (
                    <>
                      {shouldShowContactButton && (
                        <Button 
                          onClick={handleContactCreator}
                          className="w-full bg-[#6264A7] hover:bg-[#5a5c9e] text-white flex items-center justify-center gap-3 h-14 text-sm font-semibold shadow-md rounded-md"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          <TeamsIcon />
                          Contact Creator on Teams
                        </Button>
                      )}
                      
                      {/* Contact Co-Creator Button */}
                      {collaboration.coCreator && !isCreator && collaboration.status === 'Open' && (
                        <Button 
                          onClick={handleContactCoCreator}
                          className="w-full bg-[#6264A7] hover:bg-[#5a5c9e] text-white flex items-center justify-center gap-3 h-14 text-sm font-semibold shadow-md rounded-md"
                          style={{ fontFamily: 'Segoe UI, sans-serif' }}
                        >
                          <TeamsIcon />
                          Contact Co-Creator on Teams
                        </Button>
                      )}
                    </>
                  )}
                  
                  {isCreator && collaboration.status === 'Open' && (
                    <Button 
                      onClick={handleCloseProject}
                      variant="outline"
                      className="w-full text-gray-700 border-gray-300 hover:bg-gray-50 h-12 text-base rounded-md"
                    >
                      Close Project
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Close Project Confirmation Modal */}
      <Dialog open={showCloseConfirmation} onOpenChange={setShowCloseConfirmation}>
        <DialogContent className="max-w-md mx-4 sm:mx-auto">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Segoe UI, sans-serif' }}>
              Close Project
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
              Are you sure you want to close this project?
            </p>
            <div className="text-sm text-gray-600 space-y-2" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
              <p>• Closed projects will still be visible but marked as closed.</p>
              <p>• People will no longer be able to contact you about this project.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline" 
                className="flex-1 h-12 text-base rounded-md"
                onClick={() => setShowCloseConfirmation(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 h-12 text-base rounded-md"
                onClick={confirmCloseProject}
              >
                Close Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollaborationDetailView;
