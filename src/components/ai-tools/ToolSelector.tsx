
import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Tool {
  tool_id: string;
  tool_name: string;
  category: string;
}

interface ToolSelectorProps {
  onToolSelect: (tool: Tool) => void;
}

const ToolSelector = ({ onToolSelect }: ToolSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTools = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching tools from Supabase");
        const { data, error } = await supabase
          .from('tools')
          .select('tool_id, tool_name, category')
          .order('tool_name');

        if (error) {
          console.error("Error fetching tools:", error);
          throw new Error(error.message);
        }
        
        console.log("Tools response:", data);
        
        // Ensure we always have an array and filter out any invalid entries
        const toolsData = Array.isArray(data) ? data.filter(tool => 
          tool && 
          tool.tool_id && 
          tool.tool_name && 
          tool.category
        ) : [];
        setTools(toolsData);
      } catch (error) {
        console.error("Failed to fetch tools:", error);
        setError("Failed to load tools");
        setTools([]); // Ensure tools is always an array
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchTools();
    }
  }, [open]);

  const handleSelect = (tool: Tool) => {
    setSelectedTool(tool);
    onToolSelect(tool);
    setOpen(false);
  };

  const getEmptyMessage = () => {
    if (loading) return "Loading tools...";
    if (error) return error;
    return "No tools found.";
  };

  const shouldShowItems = !loading && !error && tools.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTool ? selectedTool.tool_name : "Select a tool..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search tools..." />
          <CommandList>
            {!shouldShowItems && (
              <CommandEmpty>{getEmptyMessage()}</CommandEmpty>
            )}
            {shouldShowItems && (
              <CommandGroup className="max-h-64 overflow-auto">
                {tools.map((tool) => (
                  <CommandItem
                    key={tool.tool_id}
                    value={`${tool.tool_name}-${tool.tool_id}`}
                    onSelect={() => handleSelect(tool)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedTool?.tool_id === tool.tool_id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{tool.tool_name}</span>
                      <span className="text-xs text-muted-foreground">{tool.category}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ToolSelector;
