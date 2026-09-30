import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useI18n } from "@/i18n";

type LocationResult = {
  display_name: string;
  lat: string;
  lon: string;
};

interface IProps {
  value: string;
  latitude?: number | null;
  longitude?: number | null;
  onChange: (location: { address: string; latitude: number | null; longitude: number | null }) => void;
  disabled?: boolean;
  placeholder?: string;
  allowCurrentLocation?: boolean;
}

const NOMINATIM_URL = "https://nominatim.openstreetmap.org";

const LocationPicker = ({
  value,
  latitude,
  longitude,
  onChange,
  disabled = false,
  placeholder,
  allowCurrentLocation = true,
}: IProps) => {
  const { language } = useI18n();
  const isArabic = language === "ar";
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const lastLookupAt = useRef(0);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  const text = isArabic
    ? {
        location: "الموقع",
        search: "البحث عن الموقع",
        current: "استخدام موقعي الحالي",
        searching: "جاري البحث...",
        locating: "جاري تحديد موقعك...",
        noResults: "لم يتم العثور على نتائج. جرّب اسم منطقة أو عنوانًا أو مدينة.",
        searchError: "تعذر البحث عن الموقع الآن.",
        locationError: "تعذر الحصول على موقعك الحالي. يمكنك البحث عن المكان يدويًا.",
        select: "اختيار",
        selected: "تم اختيار الموقع",
        attribution: "البحث عن المواقع بواسطة OpenStreetMap Nominatim.",
        placeholder: "مثال: دمنهور، البحيرة",
      }
    : {
        location: "Location",
        search: "Search location",
        current: "Use my current location",
        searching: "Searching...",
        locating: "Getting your location...",
        noResults: "No location found. Try an area, address, or city name.",
        searchError: "Could not search for the location right now.",
        locationError: "Could not get your current location. You can search for the place manually.",
        select: "Select",
        selected: "Location selected",
        attribution: "Location search by OpenStreetMap Nominatim.",
        placeholder: "e.g. Damanhur, Beheira",
      };

  const waitForRateLimit = async () => {
    const elapsed = Date.now() - lastLookupAt.current;
    if (elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
    }
    lastLookupAt.current = Date.now();
  };

  const applyResult = (result: LocationResult) => {
    const nextLatitude = Number(result.lat);
    const nextLongitude = Number(result.lon);
    if (!Number.isFinite(nextLatitude) || !Number.isFinite(nextLongitude)) return;

    setQuery(result.display_name);
    setResults([]);
    setHasSearched(false);
    onChange({
      address: result.display_name,
      latitude: nextLatitude,
      longitude: nextLongitude,
    });
    toast.success(text.selected);
  };

  const searchLocation = async () => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery || isSearching || disabled) return;

    setIsSearching(true);
    setHasSearched(true);
    setResults([]);
    try {
      await waitForRateLimit();
      const url = new URL(`${NOMINATIM_URL}/search`);
      url.searchParams.set("q", normalizedQuery);
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("limit", "5");
      url.searchParams.set("addressdetails", "1");
      url.searchParams.set("accept-language", isArabic ? "ar" : "en");
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Location search failed");
      const data = (await response.json()) as LocationResult[];
      setResults(data);
      if (data.length === 0) {
        toast.info(text.noResults);
      }
    } catch {
      setResults([]);
      toast.error(text.searchError);
    } finally {
      setIsSearching(false);
    }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      await waitForRateLimit();
      const url = new URL(`${NOMINATIM_URL}/reverse`);
      url.searchParams.set("lat", String(lat));
      url.searchParams.set("lon", String(lon));
      url.searchParams.set("format", "jsonv2");
      url.searchParams.set("accept-language", isArabic ? "ar" : "en");
      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error("Reverse geocoding failed");
      const data = (await response.json()) as { display_name?: string };
      return data.display_name || "";
    } catch {
      return "";
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation || isLocating || disabled) {
      toast.error(text.locationError);
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLatitude = position.coords.latitude;
        const nextLongitude = position.coords.longitude;
        const address = await reverseGeocode(nextLatitude, nextLongitude);
        const nextAddress = address || (isArabic ? "موقعي الحالي" : "Current location");
        setQuery(nextAddress);
        setResults([]);
        setHasSearched(false);
        onChange({
          address: nextAddress,
          latitude: nextLatitude,
          longitude: nextLongitude,
        });
        toast.success(text.selected);
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        toast.error(text.locationError);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-black-blue">{text.location}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setResults([]);
            setHasSearched(false);
            onChange({ address: nextQuery, latitude: null, longitude: null });
          }}
          disabled={disabled || isSearching || isLocating}
          placeholder={placeholder || text.placeholder}
          className="flex-1"
        />
        <Button type="button" variant="outline" onClick={searchLocation} disabled={disabled || isSearching || isLocating || !query.trim()}>
          {isSearching ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <Search className="me-2 h-4 w-4" />}
          {isSearching ? text.searching : text.search}
        </Button>
        {allowCurrentLocation && (
          <Button type="button" variant="outline" onClick={useCurrentLocation} disabled={disabled || isSearching || isLocating}>
            {isLocating ? <Loader2 className="me-2 h-4 w-4 animate-spin" /> : <MapPin className="me-2 h-4 w-4" />}
            {isLocating ? text.locating : text.current}
          </Button>
        )}
      </div>

      {latitude != null && longitude != null && query.trim() && results.length === 0 && !hasSearched && (
        <p className="text-xs text-muted-foreground">{text.selected}</p>
      )}

      {results.length > 0 && (
        <div className="overflow-hidden rounded-md border bg-white shadow-sm">
          {results.map((result, index) => (
            <button
              key={`${result.lat}-${result.lon}-${index}`}
              type="button"
              className="flex w-full items-start gap-2 border-b p-3 text-start text-sm last:border-b-0 hover:bg-muted/40"
              onClick={() => applyResult(result)}
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-main" />
              <span className="flex-1">{result.display_name}</span>
              <span className="shrink-0 text-xs text-main">{text.select}</span>
            </button>
          ))}
        </div>
      )}

      <p className="text-[11px] text-muted-foreground">{text.attribution}</p>
    </div>
  );
};

export default LocationPicker;
