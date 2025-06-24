
import { useState, useEffect } from "react";
import { Star, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Review {
  tool_id: string;
  tool_name: string;
  pros: string;
  cons: string | null;
  rating: number;
  pricing_tips: string | null;
  submitted_at: string;
}

interface CommunityReviewsProps {
  toolId: string;
}

const CommunityReviews = ({ toolId }: CommunityReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Most Recent");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('tool_insights')
          .select('*')
          .eq('tool_id', toolId)
          .order('submitted_at', { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err: any) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [toolId]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `about ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 font-semibold">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-xl font-bold mb-4">Community Reviews (0)</h3>
        <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Community Reviews ({reviews.length})</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Most Recent">Most Recent</SelectItem>
              <SelectItem value="Highest Rating">Highest Rating</SelectItem>
              <SelectItem value="Lowest Rating">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                {renderStars(review.rating)}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Current User</div>
                <div className="text-xs text-muted-foreground">
                  {formatTimeAgo(review.submitted_at)}
                </div>
              </div>
            </div>

            {review.pros && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-600">What Worked Well</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{review.pros}</p>
              </div>
            )}

            {review.cons && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-600">What Didn't Work</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{review.cons}</p>
              </div>
            )}

            {review.pricing_tips && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600">Pricing Tips</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">{review.pricing_tips}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityReviews;
