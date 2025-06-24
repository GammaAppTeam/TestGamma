
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ToolWithInsights } from "@/hooks/useAIToolsLibraryData";

interface ToolInsightFormProps {
  tool: ToolWithInsights;
  onInsightSubmitted: () => void;
}

const ToolInsightForm = ({ tool, onInsightSubmitted }: ToolInsightFormProps) => {
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [pricingTips, setPricingTips] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pros.trim() || rating === 0) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      // Insert tool insight
      const { error: insightError } = await supabase
        .from('tool_insights')
        .insert({
          tool_id: tool.tool_id,
          tool_name: tool.tool_name,
          pros: pros.trim(),
          cons: cons.trim() || null,
          rating: rating,
          pricing_tips: pricingTips.trim() || null,
        });

      if (insightError) throw insightError;

      toast({
        title: "Success!",
        description: "Your insight has been submitted successfully",
      });

      onInsightSubmitted();
    } catch (error: any) {
      console.error("Error submitting insight:", error);
      toast({
        title: "Error",
        description: "Failed to submit insight. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-base font-semibold">
          Overall Rating <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Rate your overall experience with this tool
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 transition-colors"
            >
              <Star 
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="pros" className="text-base font-semibold">
          What Worked Well <span className="text-red-500">*</span>
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          What features or aspects worked well for you?
        </p>
        <Textarea
          id="pros"
          value={pros}
          onChange={(e) => setPros(e.target.value)}
          placeholder="What features or aspects worked well for you?"
          className="min-h-[100px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="cons" className="text-base font-semibold">
          What Didn't Work (Optional)
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Any limitations or issues you encountered?
        </p>
        <Textarea
          id="cons"
          value={cons}
          onChange={(e) => setCons(e.target.value)}
          placeholder="Any limitations or issues you encountered?"
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="pricing-tips" className="text-base font-semibold">
          Pricing Tips (Optional)
        </Label>
        <p className="text-sm text-muted-foreground mb-3">
          Any advice about pricing, plans, or cost optimization?
        </p>
        <Textarea
          id="pricing-tips"
          value={pricingTips}
          onChange={(e) => setPricingTips(e.target.value)}
          placeholder="Any advice about pricing, plans, or cost optimization?"
          className="min-h-[100px]"
        />
      </div>

      <Button 
        type="submit" 
        disabled={submitting}
        className="w-full"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

export default ToolInsightForm;
