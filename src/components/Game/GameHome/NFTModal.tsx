'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFarcasterContext } from "hooks/useFarcasterContext";
import { useMiniAppHaptics } from "hooks/useMiniAppHaptics";

interface NFTModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  imageSrc: string;
}

export function NFTModal({ isOpen, onClose, title, imageSrc }: NFTModalProps) {
  const { isInMiniApp } = useFarcasterContext();
  const { triggerSelection } = useMiniAppHaptics();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const safeTitle = typeof title === "string" ? title : "";

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
      setLoadError(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    void triggerSelection();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      {/* Modal container - responsive sizing */}
      <div
        className={`
          relative w-full max-w-2xl
          ${isInMiniApp ? 'max-h-[85vh]' : 'max-h-[90vh]'}
          bg-gradient-to-b from-[#1a1424] to-[#0f0b16]
          border-2 border-pink-700
          rounded-2xl
          shadow-glowPink
          overflow-hidden
          animate-in zoom-in-95 duration-200
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors border border-neutral-700"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-6 w-6 text-white" />
        </button>

        {/* Content */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Title */}
          <div className="px-6 py-4 border-b border-pink-700">
            <h2 className="text-2xl md:text-3xl font-bold text-white-500 text-center">
              {title}
            </h2>
          </div>

          {/* Image container */}
          <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-lg rounded-xl overflow-hidden shadow-inner bg-[#0f0b16]">
              {!imageLoaded && !!imageSrc && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                </div>
              )}
              {imageSrc && !loadError ? (
                <Image
                  src={imageSrc}
                  alt={safeTitle || "NFT"}
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className={`object-contain transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setLoadError(true);
                    setImageLoaded(true);
                  }}
                  priority
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-[#fea282] text-4xl md:text-6xl font-bold mb-2">
                    {safeTitle ? safeTitle.substring(0, 9).toUpperCase() : "NFT"}
                  </div>
                  <div className="text-[#c0b3f1] text-sm">No image available</div>
                </div>
              )}
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
}

