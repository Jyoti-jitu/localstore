import React from "react";
import Image from "next/image";

export default function LogoLC({ className = "w-8 h-8 sm:w-9 sm:h-9", size = 36 }) {
  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      <Image
        src="/brand-icon.png"
        alt="LocalStore Logo"
        width={size}
        height={size}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
