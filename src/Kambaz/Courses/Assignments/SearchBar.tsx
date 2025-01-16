import { CiSearch } from "react-icons/ci";

export default function SearchBar() {
  return (
    <div>
      <CiSearch id="input-img" className="me-2 mb-2" />
      <input
        placeholder="Search..."
        id="wd-search-assignment"
        style={{ height: "calc(2.375rem + 2px)" }}
      />
    </div>
  );
}
