
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import ToolImage from "./ToolImage";

interface ToolCardProps {
  tool_id: string;
  tool_name: string;
  category: string;
  collective_summary: string;
  insightsCount: number;
  tool_url?: string;
}

const ToolCard = ({
  tool_id,
  tool_name,
  category,
  collective_summary,
  insightsCount,
  tool_url,
}: ToolCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/tool/${tool_id}`);
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex flex-col p-6 border border-gray-100 group cursor-pointer hover:-translate-y-1 h-48"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4 mb-4">
        <ToolImage 
          toolUrl={tool_url} 
          toolName={tool_name} 
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1" title={tool_name}>
            {tool_name}
          </h3>
          <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 text-xs">
            {category}
          </Badge>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 line-clamp-2 flex-1 mb-4">
        {stripHtml(collective_summary) || "No summary available"}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Star className="w-3 h-3" />
          <span>{insightsCount} insight{insightsCount !== 1 ? "s" : ""}</span>
        </div>
        <span className="text-xs text-indigo-600 font-medium group-hover:text-indigo-700">
          View Details →
        </span>
      </div>
    </div>
  );
};

export default ToolCard;
