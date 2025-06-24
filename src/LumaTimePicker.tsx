
import React, { useState } from 'react';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
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

interface LumaTimePickerProps {
  label: string;
  date: Date | null;
  time: string;
  duration?: string;
  timezone: string;
  onDateChange: (date: Date | null) => void;
  onTimeChange: (time: string) => void;
  onDurationChange?: (duration: string) => void;
  onTimezoneChange: (timezone: string) => void;
  required?: boolean;
  className?: string;
}

// Generate time options in 15-minute intervals - FIXED to store 12-hour format
const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const totalMinutes = i * 15;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 < 12 ? 'AM' : 'PM';
  
  // Store in 12-hour format with AM/PM instead of 24-hour format
  const value = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  const label = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
  
  return { value, label };
});

const durationOptions = [
  { value: '30', label: '30 min' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
  { value: '150', label: '2.5 hours' },
  { value: '180', label: '3 hours' },
  { value: '240', label: '4 hours' },
  { value: '300', label: '5 hours' },
  { value: '360', label: '6 hours' },
  { value: '480', label: '8 hours' }
];

const timezoneOptions = [
  { value: 'GMT-12', label: 'GMT-12 - Baker Island' },
  { value: 'GMT-11', label: 'GMT-11 - American Samoa' },
  { value: 'GMT-10', label: 'GMT-10 - Hawaii' },
  { value: 'GMT-9', label: 'GMT-9 - Alaska' },
  { value: 'GMT-8', label: 'GMT-8 - Pacific Time (US & Canada)' },
  { value: 'GMT-7', label: 'GMT-7 - Mountain Time (US & Canada)' },
  { value: 'GMT-6', label: 'GMT-6 - Central Time (US & Canada)' },
  { value: 'GMT-5', label: 'GMT-5 - Eastern Time (US & Canada)' },
  { value: 'GMT-4', label: 'GMT-4 - Atlantic Time (Canada)' },
  { value: 'GMT-3', label: 'GMT-3 - Brazil' },
  { value: 'GMT-2', label: 'GMT-2 - Mid-Atlantic' },
  { value: 'GMT-1', label: 'GMT-1 - Azores' },
  { value: 'GMT+0', label: 'GMT+0 - London, Dublin' },
  { value: 'GMT+1', label: 'GMT+1 - Paris, Berlin, Rome' },
  { value: 'GMT+2', label: 'GMT+2 - Cairo, Helsinki' },
  { value: 'GMT+3', label: 'GMT+3 - Moscow, Nairobi' },
  { value: 'GMT+4', label: 'GMT+4 - Dubai, Baku' },
  { value: 'GMT+5', label: 'GMT+5 - Karachi, Tashkent' },
  { value: 'GMT+6', label: 'GMT+6 - Dhaka, Almaty' },
  { value: 'GMT+7', label: 'GMT+7 - Bangkok, Jakarta' },
  { value: 'GMT+8', label: 'GMT+8 - Beijing, Singapore' },
  { value: 'GMT+9', label: 'GMT+9 - Tokyo, Seoul' },
  { value: 'GMT+10', label: 'GMT+10 - Sydney, Melbourne' },
  { value: 'GMT+11', label: 'GMT+11 - Solomon Islands' },
  { value: 'GMT+12', label: 'GMT+12 - Auckland, Fiji' }
];

const LumaTimePicker: React.FC<LumaTimePickerProps> = ({
  label,
  date,
  time,
  duration = '60',
  timezone,
  onDateChange,
  onTimeChange,
  onDurationChange,
  onTimezoneChange,
  required = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDisplayTime = () => {
    if (!date || !time) return 'Select date and time';

    // Parse time that's now in 12-hour format (e.g., "11:00 AM")
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!timeMatch) return 'Select date and time';
    
    const [, hourStr, minuteStr, ampm] = timeMatch;
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    
    // Convert to 24-hour for duration calculation
    if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
    
    const endMinutes = minute + parseInt(duration);
    const endHour = hour + Math.floor(endMinutes / 60);
    const finalEndMinute = endMinutes % 60;

    const formatTime = (h: number, m: number) => {
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      const ampm = h < 12 ? 'AM' : 'PM';
      return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
    };

    const dateStr = format(date, 'EEE, MMM d, yyyy');
    const startTimeStr = time; // Already in 12-hour format
    const endTimeStr = formatTime(endHour, finalEndMinute);

    return `${dateStr} • ${startTimeStr} - ${endTimeStr}`;
  };

  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </Label>
      
      <Popover open={isExpanded} onOpenChange={setIsExpanded}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-12 px-4 border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6]",
              (!date || !time) && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-3 h-4 w-4" />
            <span className="text-sm">{formatDisplayTime()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="start">
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <Select value={date ? format(date, 'yyyy-MM') : ''} onValueChange={() => {}}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={format(new Date(), 'yyyy-MM')}>
                    {format(new Date(), 'MMMM yyyy')}
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={time} onValueChange={onTimeChange}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent className="max-h-48">
                  {timeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {onDurationChange && (
                <Select value={duration} onValueChange={onDurationChange}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              initialFocus
              className="p-3 pointer-events-auto border rounded-md"
            />

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setIsExpanded(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={() => setIsExpanded(false)} className="bg-[#3B82F6] hover:bg-[#2563EB]">
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">Timezone</Label>
        <Select value={timezone} onValueChange={onTimezoneChange}>
          <SelectTrigger className="border-gray-300 focus:border-[#3B82F6] focus:ring-[#3B82F6]">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent className="max-h-48">
            {timezoneOptions.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LumaTimePicker;
