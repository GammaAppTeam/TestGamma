
import ToolCard from "./ToolCard";
import ToolCardSkeleton from "./ToolCardSkeleton";
import { ToolWithInsights } from "@/hooks/useAIToolsLibraryData";

interface ToolCardsGridProps {
  tools: ToolWithInsights[];
  loading: boolean;
}

const ToolCardsGrid = ({ tools, loading }: ToolCardsGridProps) => {
  // Show 12 skeletons if loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({length: 12}).map((_, i) => (
          <ToolCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Ensure tools is always an array and filter out any null/undefined entries
  const safeTools = Array.isArray(tools) ? tools.filter(tool => tool != null) : [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {safeTools.map((tool) => (
        <ToolCard
          key={tool.tool_id}
          tool_id={tool.tool_id}
          tool_name={tool.tool_name || ""}
          category={tool.category || ""}
          collective_summary={tool.collective_summary || ""}
          insightsCount={tool.insightsCount || 0}
          tool_url={tool.tool_url || undefined}
        />
      ))}
    </div>
  );
}

export default ToolCardsGrid;
