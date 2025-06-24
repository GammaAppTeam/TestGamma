
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ToolSelector from "./ToolSelector";

const TOOL_CATEGORIES = [
  "Text Generation",
  "Image Generation", 
  "Audio Generation",
  "Video Generation",
  "TTS",
  "Prompt Engineering",
  "Code Assistant",
  "Data Analysis",
  "Research",
  "Design",
  "Other",
];

// Schema for Mode A (existing tool) - no form needed, just selection
const existingToolSchema = z.object({
  tool_id: z.string().min(1, "Please select a tool"),
});

// Schema for Mode B (new tool) - now includes tool_url
const newToolSchema = z.object({
  tool_name: z.string().min(1, "Tool name is required"),
  category: z.string().min(1, "Category is required"),
  tool_url: z.string().url("Please enter a valid URL"),
});

type ExistingToolForm = z.infer<typeof existingToolSchema>;
type NewToolForm = z.infer<typeof newToolSchema>;

interface AddToolInsightModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsightAdded: () => void;
}

const AddToolInsightModal = ({ open, onOpenChange, onInsightAdded }: AddToolInsightModalProps) => {
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedTool, setSelectedTool] = useState<{ tool_id: string; tool_name: string; category: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const existingForm = useForm<ExistingToolForm>({
    resolver: zodResolver(existingToolSchema),
    defaultValues: {
      tool_id: "",
    },
  });

  const newForm = useForm<NewToolForm>({
    resolver: zodResolver(newToolSchema),
    defaultValues: {
      tool_name: "",
      category: "",
      tool_url: "",
    },
  });

  const handleModeChange = (newMode: "existing" | "new") => {
    setMode(newMode);
    // Reset forms when switching modes
    existingForm.reset();
    newForm.reset();
    setSelectedTool(null);
  };

  const handleToolSelect = (tool: { tool_id: string; tool_name: string; category: string }) => {
    setSelectedTool(tool);
    existingForm.setValue("tool_id", tool.tool_id);
  };

  const onSubmitExisting = async (data: ExistingToolForm) => {
    setIsSubmitting(true);
    try {
      console.log("Selected existing tool:", data);
      
      // For existing tools, we just close the modal and trigger callback
      // The actual insight creation will happen on a different screen
      toast({
        title: "Success",
        description: "Tool selected successfully!",
      });
      onInsightAdded();
      onOpenChange(false);
      existingForm.reset();
      setSelectedTool(null);
    } catch (error) {
      console.error("Failed to select tool:", error);
      toast({
        title: "Error",
        description: "Failed to select tool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitNew = async (data: NewToolForm) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting new tool:", data);
      
      // Create the new tool with the tool_url field
      const { data: toolData, error: toolError } = await supabase
        .from('tools')
        .insert({
          tool_name: data.tool_name,
          category: data.category,
          tool_url: data.tool_url,
          collective_summary: "", // Empty for now, will be populated later
        })
        .select('tool_id')
        .single();

      if (toolError) {
        console.error("Error creating tool:", toolError);
        throw new Error(toolError.message);
      }

      console.log("Tool created:", toolData);

      toast({
        title: "Success",
        description: "Tool created successfully!",
      });
      onInsightAdded();
      onOpenChange(false);
      newForm.reset();
    } catch (error) {
      console.error("Failed to create tool:", error);
      toast({
        title: "Error",
        description: "Failed to create tool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    existingForm.reset();
    newForm.reset();
    setSelectedTool(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Tool Insight</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Question */}
          <div className="text-center">
            <h3 className="text-lg font-medium mb-4">Is this an existing tool?</h3>
          </div>

          {/* Mode Selector */}
          <div className="flex rounded-lg border p-1 bg-muted">
            <button
              type="button"
              onClick={() => handleModeChange("existing")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === "existing"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yes, select from list
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("new")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === "new"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              No, add new tool
            </button>
          </div>

          {/* Mode A - Existing Tool */}
          {mode === "existing" && (
            <Form {...existingForm}>
              <form onSubmit={existingForm.handleSubmit(onSubmitExisting)} className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Tool</Label>
                  <ToolSelector onToolSelect={handleToolSelect} />
                  {existingForm.formState.errors.tool_id && (
                    <p className="text-sm text-destructive">
                      {existingForm.formState.errors.tool_id.message}
                    </p>
                  )}
                </div>

                {selectedTool && (
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={selectedTool.category} readOnly className="bg-muted" />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Mode B - New Tool */}
          {mode === "new" && (
            <Form {...newForm}>
              <form onSubmit={newForm.handleSubmit(onSubmitNew)} className="space-y-4">
                <FormField
                  control={newForm.control}
                  name="tool_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Name *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter tool name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={newForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Use Case / Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TOOL_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={newForm.control}
                  name="tool_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool URL / Website *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToolInsightModal;
