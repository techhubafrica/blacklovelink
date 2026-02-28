import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface CountryCode {
    name: string;
    code: string; // e.g. "+1"
    iso: string;  // e.g. "US"
    flag: string; // emoji
}

export const COUNTRY_CODES: CountryCode[] = [
    { name: "United States", code: "+1", iso: "US", flag: "🇺🇸" },
    { name: "Canada", code: "+1", iso: "CA", flag: "🇨🇦" },
    { name: "United Kingdom", code: "+44", iso: "GB", flag: "🇬🇧" },
    { name: "Nigeria", code: "+234", iso: "NG", flag: "🇳🇬" },
    { name: "Ghana", code: "+233", iso: "GH", flag: "🇬🇭" },
    { name: "Kenya", code: "+254", iso: "KE", flag: "🇰🇪" },
    { name: "South Africa", code: "+27", iso: "ZA", flag: "🇿🇦" },
    { name: "Ethiopia", code: "+251", iso: "ET", flag: "🇪🇹" },
    { name: "Tanzania", code: "+255", iso: "TZ", flag: "🇹🇿" },
    { name: "Uganda", code: "+256", iso: "UG", flag: "🇺🇬" },
    { name: "Rwanda", code: "+250", iso: "RW", flag: "🇷🇼" },
    { name: "Cameroon", code: "+237", iso: "CM", flag: "🇨🇲" },
    { name: "Côte d'Ivoire", code: "+225", iso: "CI", flag: "🇨🇮" },
    { name: "Senegal", code: "+221", iso: "SN", flag: "🇸🇳" },
    { name: "Zimbabwe", code: "+263", iso: "ZW", flag: "🇿🇼" },
    { name: "Zambia", code: "+260", iso: "ZM", flag: "🇿🇲" },
    { name: "Mozambique", code: "+258", iso: "MZ", flag: "🇲🇿" },
    { name: "Angola", code: "+244", iso: "AO", flag: "🇦🇴" },
    { name: "DR Congo", code: "+243", iso: "CD", flag: "🇨🇩" },
    { name: "Morocco", code: "+212", iso: "MA", flag: "🇲🇦" },
    { name: "Egypt", code: "+20", iso: "EG", flag: "🇪🇬" },
    { name: "Algeria", code: "+213", iso: "DZ", flag: "🇩🇿" },
    { name: "Tunisia", code: "+216", iso: "TN", flag: "🇹🇳" },
    { name: "Jamaica", code: "+1876", iso: "JM", flag: "🇯🇲" },
    { name: "Trinidad & Tobago", code: "+1868", iso: "TT", flag: "🇹🇹" },
    { name: "Barbados", code: "+1246", iso: "BB", flag: "🇧🇧" },
    { name: "Bahamas", code: "+1242", iso: "BS", flag: "🇧🇸" },
    { name: "Haiti", code: "+509", iso: "HT", flag: "🇭🇹" },
    { name: "France", code: "+33", iso: "FR", flag: "🇫🇷" },
    { name: "Germany", code: "+49", iso: "DE", flag: "🇩🇪" },
    { name: "Netherlands", code: "+31", iso: "NL", flag: "🇳🇱" },
    { name: "Belgium", code: "+32", iso: "BE", flag: "🇧🇪" },
    { name: "Italy", code: "+39", iso: "IT", flag: "🇮🇹" },
    { name: "Spain", code: "+34", iso: "ES", flag: "🇪🇸" },
    { name: "Portugal", code: "+351", iso: "PT", flag: "🇵🇹" },
    { name: "Brazil", code: "+55", iso: "BR", flag: "🇧🇷" },
    { name: "Australia", code: "+61", iso: "AU", flag: "🇦🇺" },
    { name: "India", code: "+91", iso: "IN", flag: "🇮🇳" },
    { name: "China", code: "+86", iso: "CN", flag: "🇨🇳" },
    { name: "Japan", code: "+81", iso: "JP", flag: "🇯🇵" },
    { name: "UAE", code: "+971", iso: "AE", flag: "🇦🇪" },
    { name: "Saudi Arabia", code: "+966", iso: "SA", flag: "🇸🇦" },
];

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    selectedCountry: CountryCode;
    onCountryChange: (country: CountryCode) => void;
    placeholder?: string;
    className?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const PhoneInput = ({
    value,
    onChange,
    selectedCountry,
    onCountryChange,
    placeholder = "000 000 0000",
    className = "",
    onKeyDown,
}: PhoneInputProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const filtered = COUNTRY_CODES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.includes(search)
    );

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Focus search when dropdown opens
    useEffect(() => {
        if (open) setTimeout(() => searchRef.current?.focus(), 50);
    }, [open]);

    const inputCls =
        "w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40 transition placeholder:text-muted-foreground/60";

    return (
        <div className={`flex gap-2 ${className}`}>
            {/* Country code selector */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-1.5 px-3 py-3 rounded-xl bg-muted border border-border text-sm font-medium text-foreground hover:bg-muted/80 hover:border-primary/40 transition min-w-[76px] h-full"
                >
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span className="text-muted-foreground">{selectedCountry.code}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute left-0 top-full mt-1.5 z-50 w-72 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                        {/* Search */}
                        <div className="p-2 border-b border-border">
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted">
                                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search country or code…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none w-full"
                                />
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-56 overflow-y-auto">
                            {filtered.length === 0 ? (
                                <p className="text-center text-sm text-muted-foreground py-4">No results</p>
                            ) : (
                                filtered.map((country) => (
                                    <button
                                        key={`${country.iso}-${country.code}`}
                                        type="button"
                                        onClick={() => {
                                            onCountryChange(country);
                                            setOpen(false);
                                            setSearch("");
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors ${selectedCountry.iso === country.iso && selectedCountry.code === country.code
                                                ? "bg-primary/10 text-primary"
                                                : "text-foreground"
                                            }`}
                                    >
                                        <span className="text-base flex-shrink-0">{country.flag}</span>
                                        <span className="flex-1 truncate">{country.name}</span>
                                        <span className="text-muted-foreground font-mono text-xs">{country.code}</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Phone number input */}
            <input
                type="tel"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
                onKeyDown={onKeyDown}
                className={`flex-1 ${inputCls}`}
            />
        </div>
    );
};

export default PhoneInput;
