import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";

interface IProps {
  placeholder: string;
  ariaLabel?: string;
}

const SearchInput = ({ placeholder, ariaLabel }: IProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q");

  return (
    <Input
      type="search"
      placeholder={placeholder}
      aria-label={ariaLabel ?? placeholder}
      value={search ?? ""}
      className="w-full md:max-w-md py-2.5 md:py-3 placeholder:h-14 h-auto border-black/20 text-black placeholder:text-muted placeholder:text-sm"
      onChange={(e) => {
        const value = e.target.value;
        const nextParams = new URLSearchParams(searchParams);

        if (value) nextParams.set("q", value);
        else nextParams.delete("q");

        setSearchParams(nextParams);
      }}
    />
  );
};

export default SearchInput;
