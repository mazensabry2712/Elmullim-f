import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  onChange: (location: {
    address: string;
    latitude: number | null;
    longitude: number | null;
  }) => void;
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
        searchPlaceholder: "اكتب اسم المدينة أو المنطقة أو العنوان",
        search: "بحث",
        current: "موقعي الحالي",
        searching: "جاري البحث...",
        locating: "جاري تحديد موقعك...",
        noResults: "لم يتم العثور على نتائج. جرّب اسم مدينة أو منطقة أو عنوانًا أوضح.",
        searchError: "تعذر البحث عن الموقع الآن.",
        locationError: "تعذر الحصول على موقعك الحالي. يمكنك البحث عن المكان يدويًا.",
        select: "اختيار هذا المكان",
        selected: "الموقع المحدد",
        clear: "مسح الموقع",
        mapPreview: "معاينة الموقع على الخريطة",
        searchHint: "اضغط «بحث» لعرض النتائج ثم اختر المكان الصحيح.",
        selectedHint: "يمكنك تغيير المكان في أي وقت. الإحداثيات تتحدث تلقائيًا مع الاختيار.",
        attribution: "الخريطة والبيانات © OpenStreetMap contributors",
      }
    : {
        location: "Location",
        searchPlaceholder: "Search city, area, or address",
        search: "Search",
        current: "Use my current location",
        searching: "Searching...",
        locating: "Getting your location...",
        noResults: "No location found. Try a clearer city, area, or address.",
        searchError: "Could not search for the location right now.",
        locationError: "Could not get your current location. You can search for the place manually.",
        select: "Use this location",
        selected: "Selected location",
        clear: "Clear location",
        mapPreview: "Location preview",
        searchHint: "Press Search to load results, then choose the correct place.",
        selectedHint: "You can change the location anytime. Coordinates update automatically.",
        attribution: "Map data © OpenStreetMap contributors",
      };

  const waitForRateLimit = async () => {
    const elapsed = Date.now() - lastLookupAt.current;
    if (elapsed < 1000) {
      await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
    }
    lastLookupAt.current = Date.now();
  };

  const hasCoordinates =
    latitude != null &&
    longitude != null &&
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude));

  const mapUrl = useMemo(() => {
    if (!hasCoordinates) return "";
    const lat = Number(latitude);
    const lon = Number(longitude);
    const deltaLat = 0.025;
    const deltaLon = 0.03;
    const minLon = Math.max(-180, lon - deltaLon);
    const maxLon = Math.min(180, lon + deltaLon);
    const minLat = Math.max(-85, lat - deltaLat);
    const maxLat = Math.min(85, lat + deltaLat);

    const params = new URLSearchParams({
      bbox: \`${minLon},${minLat},${maxLon},${maxLat}\`,
      layer: "mapnik",
      marker: \`${lat},${lon}\`,
    });

    return \`https://www.openstreetmap.org/export/embed.html?${params.toString()}\`;
  }, [hasCoordinates, latitude, longitude]);

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

      const url = new URL(\`${NOMINATIM_URL}/search\`);
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

      const url = new URL(\`${NOMINATIM_URL}/reverse\`);
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
        const nextAddress =
          address || (isArabic ? "موقعي الحالي" : "Current location");

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
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  const clearLocation = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);

    onChange({
      address: "",
      latitude: null,
      longitude: null,
    });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-black-blue">
        {text.location}
      </label>

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <MapPin className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-main" />
            <Input
              value={query}
              onChange={(event) => {
                const nextQuery = event.target.value;
                setQuery(nextQuery);
                setResults([]);
                setHasSearched(false);

                onChange({
                  address: nextQuery,
                  latitude: null,
                  longitude: null,
                });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void searchLocation();
                }
              }}
              disabled={disabled || isSearching || isLocating}
              placeholder={placeholder || text.searchPlaceholder}
              className="h-11 ps-10 pe-10"
            />

            {query && !disabled && !isSearching && !isLocating ? (
              <button
                type="button"
                onClick={clearLocation}
                aria-label={text.clear}
                title={text.clear}
                className="absolute end-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <Button
            type="button"
            onClick={() => void searchLocation()}
            disabled={disabled || isSearching || isLocating || !query.trim()}
            className="h-11 shrink-0"
          >
            {isSearching ? (
              <Loader2 className="me-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="me-2 h-4 w-4" />
            )}
            {isSearching ? text.searching : text.search}
          </Button>

          {allowCurrentLocation ? (
            <Button
              type="button"
              variant="outline"
              onClick={useCurrentLocation}
              disabled={disabled || isSearching || isLocating}
              className="h-11 shrink-0"
            >
              {isLocating ? (
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="me-2 h-4 w-4" />
              )}
              {isLocating ? text.locating : text.current}
            </Button>
          ) : null}
        </div>

        {!hasSearched && !hasCoordinates ? (
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            {text.searchHint}
          </p>
        ) : null}

        {hasSearched && !isSearching && results.length === 0 ? (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {text.noResults}
          </div>
        ) : null}

        {results.length > 0 ? (
          <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            {results.map((result, index) => (
              <button
                key={\`${result.lat}-${result.lon}-${index}\`}
                type="button"
                onClick={() => applyResult(result)}
                className="flex w-full items-start gap-3 border-b border-gray-200 p-3 text-start transition hover:bg-white last:border-b-0"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-main/10 text-main">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-5 text-black-blue">
                    {result.display_name}
                  </span>
                  <span className="mt-1 block text-xs text-main">
                    {text.select}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {hasCoordinates ? (
          <div className="mt-4 overflow-hidden rounded-xl border border-main/20 bg-main/5">
            <div className="flex items-start gap-3 p-3 sm:p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-main text-white">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-black-blue">{text.selected}</p>
                <p className="mt-1 break-words text-sm leading-6 text-gray-600">
                  {value || query}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  {text.selectedHint}
                </p>
              </div>
            </div>

            <div className="border-t border-main/10 bg-white">
              <div className="px-3 pb-2 pt-3 sm:px-4">
                <h4 className="text-sm font-semibold text-black-blue">
                  {text.mapPreview}
                </h4>
              </div>

              <iframe
                title={text.mapPreview}
                src={mapUrl}
                loading="lazy"
                className="h-64 w-full border-0 sm:h-72"
              />

              <div className="border-t border-gray-100 px-3 py-2 text-[11px] text-gray-500 sm:px-4">
                {text.attribution}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LocationPicker;
