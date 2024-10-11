import SearchBar from "@/app/(app)/vocabulary/searchbar";
import MainContent from "@/app/(app)/vocabulary/maincontent";

export default function Vocabulary() {
  return (
    <div className="flex flex-col items-center">
      <SearchBar />
      <MainContent />
    </div>
  );
}
