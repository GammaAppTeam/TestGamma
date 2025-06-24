
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchSortBarProps {
  search: string;
  setSearch: (s: string) => void;
  sort: "Newest" | "Most Insights";
  setSort: (s: "Newest" | "Most Insights") => void;
}

const SearchSortBar = ({ search, setSearch, sort, setSort }: SearchSortBarProps) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
    <Input
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search by tool name…"
      className="max-w-xs"
      aria-label="Search by tool name"
    />
    <div>
      <Select value={sort} onValueChange={val => setSort(val as "Newest" | "Most Insights")}>
        <SelectTrigger className="w-44">
          <SelectValue>{sort}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Newest">Newest</SelectItem>
          <SelectItem value="Most Insights">Most Insights</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

export default SearchSortBar;
