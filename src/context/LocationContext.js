"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getLocalities } from "@/lib/supabase/db";

const LocationContext = createContext(null);

function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function LocationProvider({ children }) {
  const [city, setCity] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCity = localStorage.getItem("localstore_city");
        if (savedCity) return savedCity;
      } catch (e) {
        console.error(e);
      }
    }
    return "Bhubaneswar";
  });
  const [localities, setLocalities] = useState([]);
  const [currentLocality, setCurrentLocality] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLoc = localStorage.getItem("localstore_locality_obj");
        if (savedLoc) return JSON.parse(savedLoc);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      id: "jayadev-vihar",
      name: "Jayadev Vihar",
      landmark: "Near Pal Heights & Fortune Towers",
      distanceText: "0.8 km"
    };
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState(null);

  // Helper to match nearest locality from database coordinates
  const findNearestLocality = useCallback((userLat, userLng, list) => {
    if (!list || list.length === 0) return null;
    let nearest = null;
    let minDistance = Infinity;

    for (const loc of list) {
      if (loc.latitude != null && loc.longitude != null) {
        const dist = calculateHaversineDistanceKm(userLat, userLng, loc.latitude, loc.longitude);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = {
            ...loc,
            distanceText: dist < 1 ? "Current location" : `${dist.toFixed(1)} km away`,
            userDistanceKm: dist
          };
        }
      }
    }

    return nearest || list[0];
  }, []);

  // Detect location using browser GPS or IP fallback
  const detectLocation = useCallback((customList) => {
    const listToSearch = (customList && customList.length > 0) ? customList : localities;
    setIsDetecting(true);

    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoordinates({ latitude, longitude });

        // Match with nearest locality in Supabase database
        const targetList = listToSearch.length > 0 ? listToSearch : await getLocalities();
        const matched = findNearestLocality(latitude, longitude, targetList);

        if (matched) {
          setCurrentLocality(matched);
          try {
            localStorage.setItem("localstore_locality", matched.id);
            localStorage.setItem(
              "localstore_user_coords",
              JSON.stringify({ lat: latitude, lng: longitude })
            );
          } catch (e) {
            console.error(e);
          }
        }

        // Reverse-geocode to detect city or colony name (non-blocking)
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const geo = await res.json();
            if (geo.city) {
              setCity(geo.city);
            }
          }
        } catch {
          // silently continue
        }

        setIsDetecting(false);
        setIsModalOpen(false);
      },
      (err) => {
        console.log("Geolocation prompt or detection error:", err.message);
        setIsDetecting(false);

        // Fallback: Try fast IP-based location if GPS is unavailable
        fetch("https://ipwho.is/")
          .then((r) => r.json())
          .then(async (ipData) => {
            if (ipData && ipData.latitude && ipData.longitude) {
              setUserCoordinates({ latitude: ipData.latitude, longitude: ipData.longitude });
              const targetList = listToSearch.length > 0 ? listToSearch : await getLocalities();
              const matched = findNearestLocality(ipData.latitude, ipData.longitude, targetList);
              if (matched) {
                setCurrentLocality(matched);
                if (ipData.city) setCity(ipData.city);
              }
            }
          })
          .catch(() => {});
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 120000
      }
    );
  }, [localities, findNearestLocality]);

  useEffect(() => {
    let isMounted = true;

    getLocalities().then((data) => {
      if (isMounted && data && data.length > 0) {
        setLocalities(data);

        // Check if user previously had a locality saved
        let initialLoc = data[0];
        try {
          const saved = localStorage.getItem("localstore_locality");
          if (saved) {
            const found = data.find(
              (l) => l.id === saved || l.name?.toLowerCase() === saved?.toLowerCase()
            );
            if (found) initialLoc = found;
          }
        } catch (e) {
          console.error(e);
        }

        setCurrentLocality(initialLoc);
        // User manually selects the location. No auto-detection on entry.
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const selectCity = (cityName) => {
    setCity(cityName);
    try {
      localStorage.setItem("localstore_city", cityName);
    } catch (e) {
      console.error(e);
    }
  };

  const selectLocality = (loc, cityName) => {
    setCurrentLocality(loc);
    if (cityName) {
      setCity(cityName);
      try {
        localStorage.setItem("localstore_city", cityName);
      } catch (e) {
        console.error(e);
      }
    }
    try {
      localStorage.setItem("localstore_locality", loc.id);
      localStorage.setItem("localstore_locality_obj", JSON.stringify(loc));
    } catch (e) {
      console.error(e);
    }
    setIsModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        city,
        setCity,
        selectCity,
        currentLocality,
        localities,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
        selectLocality,
        detectLocation: () => detectLocation(localities),
        isDetecting,
        userCoordinates
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
