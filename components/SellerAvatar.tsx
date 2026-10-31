import React from "react";
import AuthenticatedImage from "@/components/AuthenticatedImage";

interface Props {
  name?: string;
  imageUrl?: string;
  size?: number;
  className?: string;
}

const SellerAvatar = ({ name, imageUrl, size = 32, className = "" }: Props) => {
  const initials = (
    <span
      className={`rounded-full bg-secondary-super-light text-secondary-mid flex items-center justify-center font-black shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );

  if (!imageUrl) return initials;

  return (
    <AuthenticatedImage
      src={imageUrl}
      alt={name || "Seller"}
      className={`rounded-full object-cover shrink-0 ${className}`}
      style={{ width: size, height: size }}
      fallback={initials}
    />
  );
};

export default SellerAvatar;
