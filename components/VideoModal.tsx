"use client";

import { useEffect, useRef, useCallback } from "react";

interface VideoModalProps {
  videoUrl?: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
}

function parseVideoUrl(url: string | undefined): { type: "youtube" | "loom" | null; embedUrl: string | null } {
  if (!url) return { type: null, embedUrl: null };

  // YouTube formats:
  // https://www.youtube.com/watch?v=VIDEO_ID
  // https://youtu.be/VIDEO_ID
  // https://youtube.com/embed/VIDEO_ID
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return {
        type: "youtube",
        embedUrl: `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`,
      };
    }
  }

  // Loom format: https://www.loom.com/share/VIDEO_ID
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  if (loomMatch && loomMatch[1]) {
    return {
      type: "loom",
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}?autoplay=1`,
    };
  }

  return { type: null, embedUrl: null };
}

export default function VideoModal({
  videoUrl,
  projectName,
  isOpen,
  onClose,
}: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const { embedUrl } = parseVideoUrl(videoUrl);

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      const previouslyFocused = document.activeElement as HTMLElement;

      // Add escape key listener
      document.addEventListener("keydown", handleKeyDown);

      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);

      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";

        // Return focus to previously focused element
        previouslyFocused?.focus();
      };
    }
  }, [isOpen, handleKeyDown]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (!embedUrl) {
    return (
      <div
        ref={modalRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <p className="text-warm-text mb-4">Unable to load video</p>
          <p className="text-warm-text/60 text-sm mb-6">
            The video URL format is not supported.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-warm-coral text-white font-semibold rounded-xl hover:bg-[#c47a5f] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Close button */}
      <button
        ref={closeButtonRef}
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-3 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Close video"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Video container */}
      <div className="w-full max-w-5xl animate-in zoom-in-95 duration-300">
        {/* Hidden title for accessibility */}
        <h2 id="modal-title" className="sr-only">
          {projectName} - Video Demo
        </h2>

        {/* Video wrapper with 16:9 aspect ratio */}
        <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl">
          <iframe
            src={embedUrl}
            title={`${projectName} demo video`}
            className="absolute inset-0 w-full h-full"
            sandbox="allow-scripts allow-same-origin allow-presentation"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Project name below video */}
        <p className="mt-4 text-center text-white/70 text-sm sm:text-base font-sans">
          {projectName}
        </p>
      </div>
    </div>
  );
}
