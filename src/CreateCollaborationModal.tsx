import React, { useState } from 'react';
import { X, Plus, CalendarIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import LumaTimePicker from './LumaTimePicker';
import CoCreatorPicker from "./CoCreatorPicker";

interface CreateCollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const formatOptions = [
  { 
    value: 'weekly_learning', 
    label: 'Learning Circle',
    group: 'structured'
  },
  { 
    value: 'hackathon', 
    label: 'Hackathon / Side Project',
    group: 'structured'
  },
  { 
    value: 'meetup_pod', 
    label: 'Meetup / Pod',
    group: 'structured'
  },
  { 
    value: 'custom_open_canvas', 
    label: '✨ Open Format',
    group: 'structured'
  },
  { 
    value: 'job_function_chat', 
    label: '💼 Job Function or Interest-Based Chat',
    group: 'community'
  }
];

const frequencyOptions = [
  { value: 'ad-hoc', label: 'Ad hoc' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' }
];

const weekdayOptions = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' }
];

const timezoneOptions = [
  'GMT-12',
  'GMT-11',
  'GMT-10',
  'GMT-9',
  'GMT-8',
  'GMT-7',
  'GMT-6',
  'GMT-5',
  'GMT-4',
  'GMT-3',
  'GMT-2',
  'GMT-1',
  'GMT+0',
  'GMT+1',
  'GMT+2',
  'GMT+3',
  'GMT+4',
  'GMT+5',
  'GMT+6',
  'GMT+7',
  'GMT+8',
  'GMT+9',
  'GMT+10',
  'GMT+11',
  'GMT+12'
];

const inspirationData = {
  weekly_learning: [
    'AI Paper Reading Group',
    'Prompt Engineering Practice Pod',
    '"LLMs for Product Managers" Weekly Circle',
    'Women in AI Learning Cohort',
    'LangChain 101 Study Pod'
  ],
  hackathon: [
    'Build a GPT for Career Advice',
    'LLM-Powered Resume Scanner',
    'GPT + Streamlit Portfolio',
    'Auto-agent Hackathon Entry',
    'AI Chatbot for Accessibility'
  ],
  meetup_pod: [
    'Saturday AI Brunch (Melbourne)',
    'Async Job Search Support Circle',
    'Resume Review Buddy Pod',
    'Introverts Learning Together',
    'Monthly GPT Demo Night'
  ],
  custom_open_canvas: [
    'AI-powered habit trackers',
    'Debate club: Should GPTs replace resumes?',
    'Creative GPT storytelling lab',
    'Career support circle ("Personal Board of Directors")',
    'Mindfulness + AI community',
    'GPT Games',
    'AI for Community Organising',
    'Teaching Kids GenAI AI',
    'Skill Swap: Designers teach Figma, Developers teach Git',
    'Peer-to-peer Code Review Group',
    'Resume Review Squad: Exchange feedback sessions',
    'Public Speaking & Presentation Skills Exchange',
    'Creative Writing & Editing Buddy Circle',
    'Photography for Techies, Coding for Creatives',
    'Excel Masters teach Shortcuts, Project Managers teach Planning',
    'Language Exchange: Practice sessions for non-native speakers',
    'Mock Interview Exchange (you coach, get coached)',
    'LinkedIn Profile & Networking Tips Swap',
    'Portfolio Review & Peer Critique Pod',
    'Growth Mindset Support: Strategy/Tactic Exchange',
    'SEO & Content: Writers and Marketers swap skills',
  ],
  job_function_chat: [
    'Product Managers in AI',
    'Creative Technologists Circle',
    'Women Exploring LLMs',
    'Career Switchers into Tech',
    'AI for Education Practitioners'
  ]
};

const placeholderText = {
  weekly_learning: "What will your group explore each week? Mention the topic, format (e.g., weekly call or async chat), and who it's for.",
  hackathon: "What are you building together? Mention your goal, timeline, skills you're looking for, and collaboration expectations.",
  meetup_pod: "Who do you want to connect with? Mention the goal (e.g., accountability, career support), meetup style, and city if local.",
  custom_open_canvas: "Describe your peer group, skill swap, or creative collaboration idea! Mention what skills people can teach or learn, how you'd structure sessions, and what makes your group special.",
  job_function_chat: "Describe the group you're starting — is it for people with the same role, stage, or interest? Will it be async chat, occasional sync, or both?"
};

const CreateCollaborationModal: React.FC<CreateCollaborationModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    format: '',
    title: '',
    description: '',
    skills: [] as string[],
    topicsOfInterest: [] as string[],
    groupSize: '',
    effort: '',
    startDate: null as Date | null,
    lumaLink: '',
    teamsLink: '',
    collaborationStyle: '',
    whoIsThisFor: [] as string[],
    meetingDate: null as Date | null,
    meetingTime: '',
    meetingDuration: '60',
    timezone: '',
    meetingDay: '',
    learningTime: '',
    learningTimezone: '',
    learningDate: null as Date | null,
    frequency: '',
    weekday: '',
    coCreator: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [whoIsThisForInput, setWhoIsThisForInput] = useState('');
  const [topicsInput, setTopicsInput] = useState('');
  const [showInspiration, setShowInspiration] = useState(true);

  const handleSkillAdd = (skill: string) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const handleWhoIsThisForAdd = (item: string) => {
    if (item.trim() && !formData.whoIsThisFor.includes(item.trim())) {
      setFormData(prev => ({
        ...prev,
        whoIsThisFor: [...prev.whoIsThisFor, item.trim()]
      }));
    }
  };

  const handleTopicsAdd = (topic: string) => {
    if (topic.trim() && !formData.topicsOfInterest.includes(topic.trim())) {
      setFormData(prev => ({
        ...prev,
        topicsOfInterest: [...prev.topicsOfInterest, topic.trim()]
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, value: string, handler: (val: string) => void, setter: (val: string) => void) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handler(value);
      setter('');
    }
  };

  const removeItem = (array: string[], item: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: array.filter(i => i !== item)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.format) {
      onSubmit({
        ...formData,
        id: Date.now().toString(),
        creator: 'Current User'
      });
      onClose();
      // Reset form with all required fields
      setFormData({
        format: '',
        title: '',
        description: '',
        skills: [],
        topicsOfInterest: [],
        groupSize: '',
        effort: '',
        startDate: null,
        lumaLink: '',
        teamsLink: '',
        collaborationStyle: '',
        whoIsThisFor: [],
        meetingDate: null,
        meetingTime: '',
        meetingDuration: '60',
        timezone: '',
        meetingDay: '',
        learningTime: '',
        learningTimezone: '',
        learningDate: null,
        frequency: '',
        weekday: '',
        coCreator: ''
      });
      setSkillInput('');
      setWhoIsThisForInput('');
      setTopicsInput('');
    }
  };

  const renderDynamicFields = () => {
    switch (formData.format) {
      case 'weekly_learning':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Frequency</Label>
              <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]">
                  <SelectValue placeholder="How often do you plan to meet?" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Choose the rhythm that suits your circle: ad hoc, weekly, or biweekly.</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Which day of the week do you usually meet? (Optional)</Label>
              <Select value={formData.weekday} onValueChange={(value) => setFormData(prev => ({ ...prev, weekday: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]">
                  <SelectValue placeholder="Select a weekday" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {weekdayOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Helps others plan ahead!</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Group Size</Label>
              <Select value={formData.groupSize} onValueChange={(value) => setFormData(prev => ({ ...prev, groupSize: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]">
                  <SelectValue placeholder="Select group size" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="3-5">3-5 people</SelectItem>
                  <SelectItem value="6-10">6-10 people</SelectItem>
                  <SelectItem value="10+">10+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <LumaTimePicker
              label="When's your first session? (Optional but helpful!)"
              date={formData.learningDate}
              time={formData.learningTime}
              timezone={formData.learningTimezone}
              onDateChange={(date) => setFormData(prev => ({ ...prev, learningDate: date }))}
              onTimeChange={(time) => setFormData(prev => ({ ...prev, learningTime: time }))}
              onTimezoneChange={(timezone) => setFormData(prev => ({ ...prev, learningTimezone: timezone }))}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Topics of Interest</Label>
              <Input
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, topicsInput, handleTopicsAdd, setTopicsInput)}
                onBlur={() => {
                  if (topicsInput.trim()) {
                    handleTopicsAdd(topicsInput);
                    setTopicsInput('');
                  }
                }}
                placeholder="Type topics and press Enter"
                className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]"
              />
              {formData.topicsOfInterest.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.topicsOfInterest.map((topic) => (
                    <Badge key={topic} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {topic}
                      <button type="button" onClick={() => removeItem(formData.topicsOfInterest, topic, 'topicsOfInterest')} className="ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        );

      case 'hackathon':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Group Size</Label>
              <Select value={formData.groupSize} onValueChange={(value) => setFormData(prev => ({ ...prev, groupSize: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]">
                  <SelectValue placeholder="Select group size" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="2-3">2-3 people</SelectItem>
                  <SelectItem value="4-6">4-6 people</SelectItem>
                  <SelectItem value="7+">7+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Skills Needed</Label>
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, skillInput, handleSkillAdd, setSkillInput)}
                onBlur={() => {
                  if (skillInput.trim()) {
                    handleSkillAdd(skillInput);
                    setSkillInput('');
                  }
                }}
                placeholder="Type skills and press Enter"
                className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]"
              />
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {skill}
                      <button type="button" onClick={() => removeItem(formData.skills, skill, 'skills')} className="ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Estimated Effort</Label>
              <Select value={formData.effort} onValueChange={(value) => setFormData(prev => ({ ...prev, effort: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]">
                  <SelectValue placeholder="Select estimated effort" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="2-4 hrs/week">2-4 hrs/week</SelectItem>
                  <SelectItem value="5-10 hrs/week">5-10 hrs/week</SelectItem>
                  <SelectItem value="10+ hrs/week">10+ hrs/week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]",
                      !formData.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        );

      case 'meetup_pod':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Group Size</Label>
              <Select value={formData.groupSize} onValueChange={(value) => setFormData(prev => ({ ...prev, groupSize: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]">
                  <SelectValue placeholder="Select group size" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="3-5">3-5 people</SelectItem>
                  <SelectItem value="6-10">6-10 people</SelectItem>
                  <SelectItem value="10+">10+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Updated Lu.ma Integration Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-0.5">💡</div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Want to manage RSVPs?
                  </h4>
                  <p className="text-sm text-blue-800 mb-3">
                    Creating a Lu.ma event helps track attendance and send reminders. Recommended for Meetups and Pods.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                    onClick={() => window.open('https://lu.ma/create', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Create Event in Lu.ma
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lumaLink" className="text-sm font-medium text-gray-700">
                Lu.ma Link (Optional but recommended)
              </Label>
              <Input
                id="lumaLink"
                value={formData.lumaLink}
                onChange={(e) => setFormData(prev => ({ ...prev, lumaLink: e.target.value }))}
                placeholder="https://lu.ma/event/..."
                className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]"
              />
              <p className="text-xs text-gray-500">
                RSVPs are managed using Lu.ma
              </p>
              <button
                type="button"
                onClick={() => window.open('https://lu.ma/create', '_blank')}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Don't have a Lu.ma event yet? Create one now
              </button>
            </div>

            <LumaTimePicker
              label="Event Time"
              date={formData.meetingDate}
              time={formData.meetingTime}
              duration={formData.meetingDuration}
              timezone={formData.timezone}
              onDateChange={(date) => setFormData(prev => ({ ...prev, meetingDate: date }))}
              onTimeChange={(time) => setFormData(prev => ({ ...prev, meetingTime: time }))}
              onDurationChange={(duration) => setFormData(prev => ({ ...prev, meetingDuration: duration }))}
              onTimezoneChange={(timezone) => setFormData(prev => ({ ...prev, timezone: timezone }))}
              required
            />
          </>
        );

      case 'custom_open_canvas':
        return (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Group Size</Label>
              <Select value={formData.groupSize} onValueChange={(value) => setFormData(prev => ({ ...prev, groupSize: value }))}>
                <SelectTrigger className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]">
                  <SelectValue placeholder="Select group size" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="2-3">2-3 people</SelectItem>
                  <SelectItem value="4-6">4-6 people</SelectItem>
                  <SelectItem value="7+">7+ people</SelectItem>
                  <SelectItem value="Unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'job_function_chat':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="teamsLink" className="text-sm font-medium text-gray-700">
                Microsoft Teams Chat Link *
              </Label>
              <Input
                id="teamsLink"
                value={formData.teamsLink}
                onChange={(e) => setFormData(prev => ({ ...prev, teamsLink: e.target.value }))}
                placeholder="https://teams.microsoft.com/l/chat/..."
                className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Who is this for?</Label>
              <Input
                value={whoIsThisForInput}
                onChange={(e) => setWhoIsThisForInput(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, whoIsThisForInput, handleWhoIsThisForAdd, setWhoIsThisForInput)}
                onBlur={() => {
                  if (whoIsThisForInput.trim()) {
                    handleWhoIsThisForAdd(whoIsThisForInput);
                    setWhoIsThisForInput('');
                  }
                }}
                placeholder="e.g., Product Managers, Career Switchers"
                className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]"
              />
              {formData.whoIsThisFor.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.whoIsThisFor.map((item) => (
                    <Badge key={item} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                      {item}
                      <button type="button" onClick={() => removeItem(formData.whoIsThisFor, item, 'whoIsThisFor')} className="ml-2">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const isFormValid = formData.title && formData.description && formData.format && 
    (formData.format !== 'job_function_chat' || formData.teamsLink);

  const currentPlaceholder = formData.format ? placeholderText[formData.format as keyof typeof placeholderText] : "Describe your collaboration opportunity...";
  const currentInspiration = formData.format ? inspirationData[formData.format as keyof typeof inspirationData] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
            Create New Collaboration
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Format Selection with Grouped Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="format" className="text-sm font-medium text-gray-700">
              Collaboration Format *
            </Label>
            <Select value={formData.format} onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
              <SelectTrigger className="w-full border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]">
                <SelectValue placeholder="Select a format" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <div className="py-1">
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50">
                    — Structured Projects —
                  </div>
                  {formatOptions.filter(option => option.group === 'structured').map((option) => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50 pl-4">
                      {option.label}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 mt-2">
                    — Community Groups —
                  </div>
                  {formatOptions.filter(option => option.group === 'community').map((option) => (
                    <SelectItem key={option.value} value={option.value} className="hover:bg-gray-50 pl-4">
                      {option.label}
                    </SelectItem>
                  ))}
                </div>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              {formData.format === 'job_function_chat' ? 'Title' : 'Project Title'} *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={formData.format === 'job_function_chat' ? "Enter group title" : "Enter project title"}
              className="border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={currentPlaceholder}
              className="min-h-[100px] border-gray-300 focus:border-[#6264A7] focus:ring-[#6264A7]"
              required
            />
          </div>

          {/* Inspiration Panel - moved right after description */}
          {formData.format && currentInspiration.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-blue-900">Inspiration</h4>
                <button
                  type="button"
                  onClick={() => setShowInspiration(!showInspiration)}
                  className="text-blue-700 hover:text-blue-900"
                >
                  {showInspiration ? '−' : '+'}
                </button>
              </div>
              {showInspiration && (
                <ul className="space-y-1">
                  {currentInspiration.map((item, index) => (
                    <li key={index} className="text-sm text-blue-800">• {item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Dynamic Fields */}
          {renderDynamicFields()}

          {/* Creator Info */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Creator</Label>
            <Input
              value="Current User"
              disabled
              className="bg-gray-50 border-gray-300 text-gray-600"
            />
          </div>

          {/* Co-Creator Field - replaced with dynamic picker after creator */}
          <div className="space-y-2">
            {/* Replace Label and Select with the new component */}
            <CoCreatorPicker
              value={formData.coCreator}
              onChange={(id) => setFormData(prev => ({ ...prev, coCreator: id }))}
              label="Co-Creator (Optional)"
              placeholder="Choose from member directory"
            />
            <p className="text-xs text-gray-500">Team effort? Add a co-creator to help manage or run your project!</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-[#6264A7] hover:bg-[#5a5c9e] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Collaboration
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCollaborationModal;
