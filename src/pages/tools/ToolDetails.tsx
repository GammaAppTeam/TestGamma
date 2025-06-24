import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Plus, Edit, Check, X, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ToolInsightForm from "@/components/ToolInsightForm";
import CommunityReviews from "@/components/CommunityReviews";
import ToolImage from "@/components/ToolImage";
import { ToolWithInsights } from "@/hooks/useAIToolsLibraryData";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ToolDetails = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const [tool, setTool] = useState<ToolWithInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [updatingSummary, setUpdatingSummary] = useState(false);
  const { toast } = useToast();

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline',
    'list', 'bullet', 'link'
  ];

  useEffect(() => {
    const fetchTool = async () => {
      if (!toolId) return;
      
      try {
        const { data: toolData, error: toolError } = await supabase
          .from('tools')
          .select('*')
          .eq('tool_id', toolId)
          .single();

        if (toolError) throw toolError;

        // Get insights count
        const { data: insightsData, error: insightsError } = await supabase
          .from('tool_insights')
          .select('tool_id')
          .eq('tool_id', toolId);

        if (insightsError) throw insightsError;

        const toolWithInsights: ToolWithInsights = {
          ...toolData,
          insightsCount: insightsData?.length || 0
        };

        setTool(toolWithInsights);
        setSummaryText(toolData.collective_summary || "");
      } catch (err: any) {
        console.error("Error fetching tool:", err);
        setError("Failed to load tool details");
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [toolId]);

  const handleInsightSubmitted = () => {
    // Refresh tool data after insight submission
    if (toolId) {
      window.location.reload();
    }
  };

  const handleSaveSummary = async () => {
    if (!tool) return;

    setUpdatingSummary(true);
    try {
      const { error } = await supabase
        .from('tools')
        .update({ 
          collective_summary: summaryText.trim(),
          last_updated_at: new Date().toISOString()
        })
        .eq('tool_id', tool.tool_id);

      if (error) throw error;

      setTool({ ...tool, collective_summary: summaryText.trim() });
      setEditingSummary(false);
      toast({
        title: "Success!",
        description: "Collective summary updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating summary:", error);
      toast({
        title: "Error",
        description: "Failed to update summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingSummary(false);
    }
  };

  const handleCancelEdit = () => {
    setSummaryText(tool?.collective_summary || "");
    setEditingSummary(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 font-segoe">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 font-segoe">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6 hover:bg-indigo-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
          <Alert variant="destructive">
            <AlertDescription>
              {error || "Tool not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 font-segoe">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-indigo-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 hover:shadow-xl transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <ToolImage 
                toolUrl={tool.tool_url} 
                toolName={tool.tool_name} 
                size="lg"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">{tool.tool_name}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50">{tool.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4" />
                    <span>{tool.insightsCount} insight{tool.insightsCount !== 1 ? 's' : ''}</span>
                  </div>
                  {tool.tool_url && (
                    <a
                      href={tool.tool_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Collective Summary</h3>
              {!editingSummary ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingSummary(true)}
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveSummary}
                    disabled={updatingSummary}
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {updatingSummary ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={updatingSummary}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
            
            {editingSummary ? (
              <div className="border rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={summaryText}
                  onChange={setSummaryText}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Enter a detailed summary of the tool..."
                  style={{ minHeight: '150px' }}
                />
              </div>
            ) : (
              <div 
                className="text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: tool.collective_summary || "No summary available yet. Click Edit to add one." 
                }}
              />
            )}
          </div>

          <div className="bg-indigo-50 rounded-xl p-6 text-center border border-indigo-100">
            <h2 className="text-xl font-semibold mb-2 text-gray-900">Share Your Experience</h2>
            <p className="text-gray-600 mb-4">Help others by sharing what you learned using this tool</p>
            <Button 
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add Your Review
            </Button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Add Your Insight</h2>
            <ToolInsightForm 
              tool={tool} 
              onInsightSubmitted={handleInsightSubmitted}
            />
          </div>
        )}

        <CommunityReviews toolId={tool.tool_id} />
      </div>
    </div>
  );
};

export default ToolDetails;
