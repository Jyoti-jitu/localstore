"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, X, Clock, TrendingUp, Store } from "lucide-react";
import { useShops, useSearchSuggestions } from "@/hooks/useSupabaseData";

export default function SearchBar({
  placeholder = "Search for products, shops and categories...",
  autoFocus = false,
  initialQuery = "",
  className = "",
  variant = "default"
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const [prevInitialQuery, setPrevInitialQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);
  const { shops: allDbShops } = useShops();
  const { suggestions: searchSuggestions } = useSearchSuggestions();
  const shopPool = allDbShops || [];

  if (initialQuery !== prevInitialQuery) {
    setPrevInitialQuery(initialQuery);
    setQuery(initialQuery);
  }

  // Sync with browser URL params if on search page
  useEffect(() => {
    if (typeof window !== "undefined" && pathname === "/search") {
      const params = new URLSearchParams(window.location.search);
      const urlQ = params.get("q") || "";
      if (urlQ !== query) {
        setQuery(urlQ);
      }
    }
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (newVal) => {
    setQuery(newVal);
    // Live-sync when already on the search page so typing and backspace update results in real time
    if (pathname === "/search") {
      if (!newVal.trim()) {
        router.replace("/search", { scroll: false });
      } else {
        router.replace(`/search?q=${encodeURIComponent(newVal)}`, { scroll: false });
      }
    }
  };

  const handleClear = (e) => {
    if (e) e.stopPropagation();
    setQuery("");
    if (pathname === "/search") {
      router.replace("/search", { scroll: false });
    }
  };

  const handleSearch = (term) => {
    const q = (term !== undefined ? term : query).trim();
    setIsFocused(false);
    if (!q) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsFocused(false);
    } else if (e.key === "Backspace" && !query && pathname === "/search") {
      router.back();
    }
  };

  // Quick suggestions filtered by input
  const suggestionsList = searchSuggestions || [];
  const filteredSuggestions = query.trim()
    ? suggestionsList.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : suggestionsList.slice(0, 6);

  // Shop matches for instant jump
  const matchedShops = query.trim()
    ? shopPool.filter((s) => s.name.toLowerCase().includes(query.toLowerCase())).slice(0, 2)
    : [];

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        className={`flex items-center w-full min-w-0 transition-all duration-200 ${
          isHero
            ? `bg-white ${
                isFocused
                  ? "border-emerald-600 ring-4 ring-emerald-500/10 shadow-md"
                  : "border-neutral-200 shadow-sm hover:shadow-md"
              } border rounded-full pl-2 sm:pl-3 pr-1.5 py-1 sm:py-1.5`
            : `bg-neutral-50 hover:bg-neutral-100/80 focus-within:bg-white border rounded-xl ${
                isFocused
                  ? "border-emerald-600 ring-2 ring-emerald-500/15 shadow-sm"
                  : "border-neutral-200"
              }`
        }`}
      >
        <div className={`text-neutral-400 flex-shrink-0 ${isHero ? "pl-2.5 pr-2.5" : "pl-3.5 pr-2"}`}>
          <Search className={isHero ? "w-5 h-5 text-neutral-400" : "w-4 h-4"} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={placeholder}
          className={`w-full min-w-0 text-neutral-900 bg-transparent placeholder:text-neutral-400 focus:outline-none ${
            isHero ? "py-2 sm:py-2.5 text-sm sm:text-base" : "py-2.5 text-sm"
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 mr-1 text-neutral-400 hover:text-neutral-600 rounded-full"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => handleSearch()}
          className={`inline-flex items-center justify-center font-semibold transition-all ${
            isHero
              ? "w-9 h-9 sm:w-auto sm:px-7 py-2 sm:py-2.5 bg-[#00A859] hover:bg-[#00924c] active:scale-95 text-white rounded-full shadow-xs flex-shrink-0"
              : "hidden sm:inline-flex mr-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg"
          }`}
        >
          {isHero ? (
            <>
              <Search className="w-4 h-4 sm:hidden text-white" />
              <span className="hidden sm:inline text-xs sm:text-sm font-bold">Search</span>
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {/* Dropdown Suggestions */}
      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-neutral-100 overflow-hidden z-40 animate-in fade-in slide-in-from-top-1">
          {matchedShops.length > 0 && (
            <div className="p-2 border-b border-neutral-100 bg-neutral-50/50">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1">
                Matching Stores
              </div>
              {matchedShops.map((shop) => (
                <button
                  key={shop.id}
                  onClick={() => {
                    setIsFocused(false);
                    router.push(`/shop/${shop.id}`);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 text-left rounded-lg hover:bg-white hover:shadow-xs transition-colors"
                >
                  <Store className="w-4 h-4 text-emerald-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-neutral-800 truncate">{shop.name}</p>
                    <p className="text-[11px] text-neutral-400">{shop.category} · {shop.locality}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-medium px-1.5 py-0.5 rounded">
                    Open
                  </span>
                </button>
              ))}
            </div>
          )}

          <div className="p-2">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>{query.trim() ? "Search Suggestions" : "Popular Searches"}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-1.5">
              {filteredSuggestions.map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-700 text-neutral-700 text-xs rounded-lg transition-colors"
                >
                  <Search className="w-3 h-3 text-neutral-400" />
                  <span>{term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
