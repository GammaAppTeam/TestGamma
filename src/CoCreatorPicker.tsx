
import React, { useMemo, useState } from "react";
import { Command, CommandDialog, CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import UserAvatar from "@/components/UserAvatar";

// Replace MOCK_USERS IDs with real UUIDs for local development.
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

interface CoCreatorPickerProps {
  value: string; // the ID of the selected user
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  currentUserId?: string; // Add this to exclude current user
}

const CoCreatorPicker: React.FC<CoCreatorPickerProps> = ({
  value,
  onChange,
  label = "Co-Creator (Optional)",
  placeholder = "Type a name to search…",
  disabled = false,
  currentUserId
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Filter out current user from available options
  const availableUsers = useMemo(() => {
    return MOCK_USERS.filter(user => user.id !== currentUserId);
  }, [currentUserId]);

  // Find user by id (for selected display)
  const selected = useMemo(() => availableUsers.find((u) => u.id === value), [value, availableUsers]);

  // Fuzzy search (simple)
  const filtered = useMemo(() => {
    if (!search.trim()) return availableUsers;
    const s = search.trim().toLowerCase();
    return availableUsers.filter((u) => (u.name + " " + u.email).toLowerCase().includes(s));
  }, [search, availableUsers]);

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#6264A7] ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        aria-label="Select a co-creator"
        disabled={disabled}
      >
        {selected ? (
          <div className="flex items-center gap-2 flex-1">
            <UserAvatar name={selected.name} size="sm" />
            <span className="truncate">{selected.name}</span>
            <span className="ml-auto text-xs text-gray-400">{selected.email}</span>
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        {selected && (
          <button
            type="button"
            className="ml-2 text-gray-400 hover:text-red-500"
            title="Clear selection"
            tabIndex={-1}
            onClick={e => {
              e.stopPropagation();
              onChange("");
            }}
          >
            ×
          </button>
        )}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search co-creator by name or email…"
          value={search}
          onValueChange={setSearch}
          autoFocus
        />
        <CommandList>
          {filtered.length === 0 && <CommandEmpty>No users found.</CommandEmpty>}
          <CommandGroup heading="Directory" className="max-h-64 overflow-auto">
            {filtered.map((user) => (
              <CommandItem
                key={user.id}
                value={user.id}
                onSelect={() => {
                  onChange(user.id);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <div className="flex items-center gap-2">
                  <UserAvatar name={user.name} size="sm" />
                  <div>
                    <div className="text-sm">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
};

export type { CoCreatorPickerProps };
export default CoCreatorPicker;
