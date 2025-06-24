
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "./useCurrentUser";

// Mock co-creator data to match the picker
const MOCK_USERS = [
  { id: "c9be3fab-31cd-4c23-86d3-2783fe3f15dd", name: "Sarah Chen", email: "sarah.chen@email.com" },
  { id: "b63a0c14-148e-43c4-96ef-d24451a10628", name: "Mike Rodriguez", email: "mike.rodriguez@email.com" },
  { id: "ffaf4e8d-21b2-45ce-bd24-5727fbbfab85", name: "Alex Kim", email: "alex.kim@email.com" },
  { id: "fc2b5f73-c925-44ce-afbc-7b0a2ed1a610", name: "Jordan Lee", email: "jordan.lee@email.com" },
  { id: "10fb8776-0117-4f7f-b9be-ec342ee0140b", name: "Jessica Park", email: "jessica.park@email.com" },
  { id: "11111111-1111-1111-1111-111111111111", name: "Jennifer Smith", email: "jennifer.smith@email.com" },
  { id: "aa7e7b7a-cfa4-437a-8a4f-22ebb886e843", name: "Lucas Nguyen", email: "lucas.nguyen@email.com" },
  { id: "97f46f2d-6721-497e-a6b0-ae1a62aaa3eb", name: "Priya Patel", email: "priya.patel@email.com" },
];

export function useCollaborationData() {
  const queryClient = useQueryClient();
  const currentUser = useCurrentUser();

  function fromSupabaseRow(row: any) {
    const displayFormat = row.type;
    
    // Fix creator mapping - use the current user's name if this is their project
    let creatorName = "Unknown";
    if (row.uid === currentUser.id) {
      creatorName = currentUser.name;
    } else if (row.creator_name) {
      creatorName = row.creator_name;
    }

    // Fix co-creator mapping - find name from mock data if co_uid exists
    let coCreatorName = "";
    if (row.co_uid) {
      const coCreatorUser = MOCK_USERS.find(user => user.id === row.co_uid);
      coCreatorName = coCreatorUser ? coCreatorUser.name : "";
    }

    // Fix time and date display - parse timestamp string directly WITHOUT Date object
    let displayTime = "";
    let displayDate = "";
    let displayTimezone = "";
    
    if (row.meetup_start_time_local) {
      // Parse the timestamp string directly to avoid timezone conversion
      const timestampStr = row.meetup_start_time_local; // e.g., "2025-06-27T09:00:00"
      const [datePart, timePart] = timestampStr.split('T');
      const [year, month, day] = datePart.split('-');
      const [hours, minutes] = timePart.split(':').map(Number);
      
      displayDate = `${day}/${month}/${year}`;
      
      // Convert to 12-hour format for display
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours < 12 ? 'AM' : 'PM';
      displayTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      displayTimezone = row.meetup_time_zone || "";
    } else if (row.circle_time_local) {
      console.log("=== PROCESSING LEARNING CIRCLE (DIRECT STRING PARSING) ===");
      console.log("Raw DB value:", row.circle_time_local);
      console.log("Timezone from DB:", row.circle_time_zone);
      
      // Parse the timestamp string directly to avoid timezone conversion
      const timestampStr = row.circle_time_local; // e.g., "2025-06-27T09:00:00"
      const [datePart, timePart] = timestampStr.split('T');
      const [year, month, day] = datePart.split('-');
      const [hours, minutes] = timePart.split(':').map(Number);
      
      displayDate = `${day}/${month}/${year}`;
      
      // Convert to 12-hour format for display
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const ampm = hours < 12 ? 'AM' : 'PM';
      displayTime = `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      displayTimezone = row.circle_time_zone || "";
      
      console.log("FINAL DISPLAY (DIRECT PARSING):", {
        displayDate,
        displayTime,
        displayTimezone,
        parsedHours: hours,
        parsedMinutes: minutes,
        timestampStr
      });
      console.log("=== END PROCESSING ===");
    }
    
    return {
      id: row.project_id,
      project_id: row.project_id,
      format: displayFormat,
      subtype: row.subtype || "",
      title: row.title,
      description: row.description,
      skills: row.hackathon_skills_needed || [],
      topicsOfInterest: row.circle_topics_of_interest || [],
      date: row.hackathon_start_date || displayDate || "",
      time: displayTime,
      timezone: displayTimezone,
      lumaLink: row.luma_link,
      frequency: row.circle_frequency,
      weekday: row.circle_day,
      status: (row.status as "Open" | "Closed") || "Open",
      creator: creatorName,
      coCreator: coCreatorName, // Only display the name from MOCK_USERS (via co_uid)
      createdAt: new Date(row.created_at).getTime(),
      jobFunctionAudience: Array.isArray(row.job_function_chat_audience)
        ? row.job_function_chat_audience
        : row.job_function_chat_audience
          ? JSON.parse(row.job_function_chat_audience)
          : [],
      jobChatTeamsUrl: row.job_chat_teams_url || "",
      // Enhanced field mapping for detail view
      groupSize: row.group_size || "",
      effort: row.hackathon_estimated_effort || "",
      startDate: row.hackathon_start_date || "", // Display exactly as stored - no conversion
      // Add uid to the returned object so we can check ownership
      uid: row.uid,
      co_uid: row.co_uid, // expose for further lookups if needed
    };
  }

  const { data: collaborations = [], isLoading, error } = useQuery({
    queryKey: ["group_projects"],
    queryFn: async () => {
      console.log("Fetching collaborations from Supabase...");
      const { data, error } = await supabase
        .from("group_projects")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching collaborations:", error);
        throw error;
      }
      
      console.log("Fetched collaborations:", data);
      const mapped = data.map(fromSupabaseRow);
      console.log("Mapped collaborations:", mapped);
      console.log("Current user ID:", currentUser.id);
      
      // Log which ones should be "mine"
      const myProjects = mapped.filter(item => item.uid === currentUser.id);
      console.log("My projects:", myProjects);
      
      return mapped;
    },
  });

  // Helper function to store time as raw timestamp string without any Date object conversion
  const createDirectDateTime = (date: Date, time: string) => {
    console.log("=== STORING TIME AS RAW STRING (FINAL FIX) ===");
    console.log("Input date:", date.toDateString());
    console.log("Input time:", time);
    
    // Parse the time string - now it could be in 12-hour format (e.g., "11:00 AM")
    let hours: number, minutes: number;
    
    const timeMatch = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (timeMatch) {
      // 12-hour format with AM/PM
      const [, hourStr, minuteStr, ampm] = timeMatch;
      hours = parseInt(hourStr);
      minutes = parseInt(minuteStr);
      
      // Convert to 24-hour format for storage
      if (ampm.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }
    } else {
      // Fallback: assume 24-hour format
      const [hourStr, minuteStr] = time.split(":").map(Number);
      hours = hourStr;
      minutes = minuteStr;
    }
    
    console.log("Parsed hours:", hours, "minutes:", minutes);
    
    // Create a timestamp string that PostgreSQL will store exactly as-is
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hourStr = String(hours).padStart(2, '0');
    const minuteStr = String(minutes).padStart(2, '0');
    
    // Return the raw timestamp string - this avoids all JavaScript timezone conversion
    const timestampString = `${year}-${month}-${day} ${hourStr}:${minuteStr}:00`;
    console.log("Final timestamp string to store:", timestampString);
    console.log("=== END STORAGE ===");
    
    // Return the string directly to avoid any Date object timezone conversion
    return timestampString;
  };

  const createCollabMutation = useMutation({
    mutationFn: async (payload: any) => {
      console.log("Creating collaboration with payload:", payload);
      
      const finalPayload = {
        ...payload,
        creatorId: currentUser.id,
        creatorName: currentUser.name,
      };

      console.log("Final payload with creator info:", finalPayload);

      const {
        format,
        title,
        description,
        skills,
        topicsOfInterest,
        groupSize,
        effort,
        startDate,
        lumaLink,
        teamsLink,
        collaborationStyle,
        whoIsThisFor,
        meetingDate,
        meetingTime,
        meetingDuration,
        timezone,
        meetingDay,
        learningTime,
        learningTimezone,
        learningDate,
        frequency,
        weekday,
        coCreator,
        creatorId,
        creatorName,
      } = finalPayload;

      const insertObj: any = {
        title,
        description,
        type: format,
        uid: creatorId,
        group_size: groupSize || null,
        luma_link: lumaLink || null,
        status: "Open",
      };

      // Handle co-creator mapping - only store the ID (as per DB schema!)
      if (coCreator) {
        const coCreatorUser = MOCK_USERS.find(user => user.id === coCreator);
        if (coCreatorUser) {
          insertObj.co_uid = coCreator; // Store ONLY the ID
          console.log("Mapped co-creator (ID only):", { co_uid: coCreator });
        } else {
          // If not found in mock data, don't set anything
          console.warn("Co-creator not found in MOCK_USERS, not setting co_uid");
        }
      }

      console.log("Base insert object:", insertObj);

      if (format === "weekly_learning") {
        insertObj.circle_frequency = frequency || null;
        insertObj.circle_day = weekday || null;
        insertObj.circle_topics_of_interest = topicsOfInterest && topicsOfInterest.length > 0 ? topicsOfInterest : null;
        
        // Store the time directly as string without any conversion
        console.log("Learning date/time inputs (storing as string):", { learningDate, learningTime, learningTimezone });
        
        insertObj.circle_time_local =
          learningDate && learningTime
            ? createDirectDateTime(learningDate, learningTime)
            : null;
        insertObj.circle_time_zone = learningTimezone || null;
        
        console.log("Stored circle_time_local as string:", insertObj.circle_time_local);
        console.log("Added weekly_learning specific fields:", {
          circle_frequency: insertObj.circle_frequency,
          circle_day: insertObj.circle_day,
          circle_topics_of_interest: insertObj.circle_topics_of_interest,
          circle_time_local: insertObj.circle_time_local,
          circle_time_zone: insertObj.circle_time_zone,
        });
      }

      if (format === "hackathon") {
        insertObj.group_size = groupSize || null;
        insertObj.hackathon_skills_needed = skills && skills.length > 0 ? skills : null;
        insertObj.hackathon_estimated_effort = effort || null;
        
        // Store hackathon start date exactly as entered - no conversion
        if (startDate) {
          if (typeof startDate === "string") {
            insertObj.hackathon_start_date = startDate; // Store as-is if already string
          } else if (startDate instanceof Date) {
            // Format as YYYY-MM-DD only (no time/timezone conversion)
            const year = startDate.getFullYear();
            const month = String(startDate.getMonth() + 1).padStart(2, '0');
            const day = String(startDate.getDate()).padStart(2, '0');
            insertObj.hackathon_start_date = `${year}-${month}-${day}`;
          }
        } else {
          insertObj.hackathon_start_date = null;
        }
        
        console.log("Added hackathon specific fields:", {
          hackathon_skills_needed: insertObj.hackathon_skills_needed,
          hackathon_estimated_effort: insertObj.hackathon_estimated_effort,
          hackathon_start_date: insertObj.hackathon_start_date,
        });
      }

      if (format === "meetup_pod") {
        insertObj.group_size = groupSize || null;
        
        // Store the time directly as string without any conversion
        console.log("Meetup date/time inputs (storing as string):", { meetingDate, meetingTime, timezone });
        
        insertObj.meetup_start_time_local =
          meetingDate && meetingTime
            ? createDirectDateTime(meetingDate, meetingTime)
            : null;
        insertObj.meetup_duration_minutes = meetingDuration ? parseInt(meetingDuration) : null;
        insertObj.meetup_time_zone = timezone || null;
        insertObj.luma_link = lumaLink || null;
        
        console.log("Stored meetup_start_time_local as string:", insertObj.meetup_start_time_local);
        console.log("Added meetup_pod specific fields:", {
          meetup_start_time_local: insertObj.meetup_start_time_local,
          meetup_duration_minutes: insertObj.meetup_duration_minutes,
          meetup_time_zone: insertObj.meetup_time_zone,
        });
      }

      if (format === "custom_open_canvas") {
        insertObj.group_size = groupSize || null;
        console.log("Added custom_open_canvas specific fields:", {
          group_size: insertObj.group_size,
        });
      }

      if (format === "job_function_chat") {
        insertObj.job_function_chat_audience = whoIsThisFor && whoIsThisFor.length > 0 ? whoIsThisFor : null;
        insertObj.job_chat_teams_url = teamsLink || null;
        console.log("Added job_function_chat specific fields:", {
          job_function_chat_audience: insertObj.job_function_chat_audience,
          job_chat_teams_url: insertObj.job_chat_teams_url,
        });
      }

      console.log("Final insert object before Supabase:", insertObj);

      const { data, error } = await supabase.from("group_projects").insert([insertObj]).select();
      
      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }
      
      console.log("Successfully created collaboration:", data);
      return data;
    },
    onSuccess: (data) => {
      console.log("Mutation success, invalidating queries...");
      queryClient.invalidateQueries({ queryKey: ["group_projects"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ project_id, status }: { project_id: string; status: "Open" | "Closed" }) => {
      console.log("Updating status for project:", project_id, "to:", status);
      const { error } = await supabase.from("group_projects").update({ status }).eq("project_id", project_id);
      if (error) {
        console.error("Status update error:", error);
        throw error;
      }
      console.log("Status updated successfully");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group_projects"] });
    },
  });

  return {
    collaborations,
    isLoading,
    error,
    createCollabMutation,
    updateStatusMutation,
    fromSupabaseRow,
    currentUser,
  };
}
