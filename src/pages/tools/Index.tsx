
// AI Tools Library main page. See src/components for modular sections.
import { useState } from "react";
import AIToolsHeader from "@/components/AIToolsHeader";
import CategoryFilter from "@/components/CategoryFilter";
import SearchSortBar from "@/components/SearchSortBar";
import ToolCardsGrid from "@/components/ToolCardsGrid";
import AddToolInsightModal from "@/components/AddToolInsightModal";
import { useAIToolsLibraryData } from "@/hooks/useAIToolsLibraryData";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    tools, loading, error, category,
    setCategory, search, setSearch, sort, setSort,
    refetch, allCategories, isEmpty
  } = useAIToolsLibraryData();

  // Handler to refresh data after adding an insight
  const handleInsightAdded = () => {
    setModalOpen(false);
    refetch();
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 md:px-8 font-segoe">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <AIToolsHeader />
          <Button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6 py-3"
            onClick={() => setModalOpen(true)}
            size="lg"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add Tool Insight</span>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <CategoryFilter
            categories={allCategories}
            selected={category}
            onSelect={setCategory}
          />
        </div>
        
        <div className="mb-8">
          <SearchSortBar
            search={search}
            setSearch={setSearch}
            sort={sort}
            setSort={setSort}
          />
        </div>

        {error &&
          <Alert variant="destructive" className="my-6 max-w-xl mx-auto">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        }

        {!loading && isEmpty && (
          <div className="flex flex-col items-center py-24">
            <span className="text-lg text-gray-600">
              No AI tools found here.<br />Try adjusting filters or add a new insight!
            </span>
          </div>
        )}

        <ToolCardsGrid tools={tools.slice(0, 20)} loading={loading} />
      </div>
      <AddToolInsightModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onInsightAdded={handleInsightAdded}
      />
    </main>
  );
};

export default Index;
