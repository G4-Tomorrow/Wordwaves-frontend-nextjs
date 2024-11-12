import MainContent from "@/components/vocabulary/maincontent/maincontent";
import SearchBar from "@/components/vocabulary/searchbar/searchbar";

export default function Vocabulary() {
  return (
    <div className="flex flex-col items-center">
      <SearchBar />
      <MainContent />
    </div>
  );
}
