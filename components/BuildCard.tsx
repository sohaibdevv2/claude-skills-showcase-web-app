"use client";

import { useState } from "react";
import VideoModal from "./VideoModal";

interface BuildCardProps {
  projectName: string;
  builderName: string;
  school: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  websiteUrl?: string;
  artifactUrl?: string;
  videoUrl?: string;
  colorClass?: string;
}

const tagStyles: Record<string, string> = {
  productivity: "bg-warm-blue text-white font-medium shadow-sm",
  automation: "bg-warm-coral text-white font-medium shadow-sm",
  creative: "bg-warm-lavender text-white font-medium shadow-sm",
  tool: "bg-warm-pink text-white font-medium shadow-sm",
  "data analysis": "bg-warm-blue text-white font-medium shadow-sm",
  game: "bg-warm-pink text-white font-medium shadow-sm",
};

// Alternative styles when tag color matches card background - use darker shade with white text
const tagAltStyles: Record<string, string> = {
  productivity: "bg-[#5a7a94] text-white font-medium shadow-md border border-white/20",
  automation: "bg-[#b86f55] text-white font-medium shadow-md border border-white/20",
  creative: "bg-[#a594b4] text-white font-medium shadow-md border border-white/20",
  tool: "bg-[#d89aa4] text-white font-medium shadow-md border border-white/20",
  "data analysis": "bg-[#5a7a94] text-white font-medium shadow-md border border-white/20",
  game: "bg-[#d89aa4] text-white font-medium shadow-md border border-white/20",
};

// Map card colors to tag types that would clash
const cardTagColorMap: Record<string, string[]> = {
  "bg-warm-pink": ["game", "tool"],
  "bg-warm-green": [],
  "bg-warm-blue": ["productivity", "data analysis"],
  "bg-warm-coral": ["automation"],
  "bg-warm-lavender": ["creative"],
};

export default function BuildCard({
  projectName,
  builderName,
  school,
  description,
  tags,
  githubUrl,
  websiteUrl,
  artifactUrl,
  videoUrl,
  colorClass = "bg-warm-pink",
}: BuildCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className={`relative rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 ease-out hover:scale-[1.02] sm:hover:scale-105 hover:shadow-xl hover:shadow-warm-text/15 flex flex-col ${colorClass}`}
      >
        <div className="flex-1 flex flex-col space-y-3 sm:space-y-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-semibold text-warm-text mb-1">
              {projectName}
            </h3>
            <p className="text-sm text-warm-text/60 font-sans">
              {builderName} · {school}
            </p>
          </div>

          <div className="flex-1">
            <p className="text-sm sm:text-base text-warm-text/80 font-sans leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              // Check if this tag's color matches the card background
              const clashingTags = cardTagColorMap[colorClass] || [];
              const usesAltStyle = clashingTags.includes(tag);
              const tagClass = usesAltStyle
                ? (tagAltStyles[tag] || "bg-white/90 text-warm-text border border-warm-text/20")
                : (tagStyles[tag] || "bg-white/40 text-warm-text");

              return (
                <span
                  key={tag}
                  className={`px-2.5 sm:px-3 py-1 text-[13px] sm:text-sm rounded-full ${tagClass}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            {/* Primary: Video Demo (if provided) */}
            {videoUrl && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 flex items-center justify-center min-h-[48px] sm:min-h-[44px] px-5 py-3 bg-warm-coral text-white text-sm font-semibold rounded-xl hover:bg-[#c47a5f] active:bg-[#b86f55] transition-colors shadow-md"
              >
                View Demo
              </button>
            )}

            {/* Secondary: GitHub (if provided) */}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center min-h-[48px] sm:min-h-[44px] px-5 py-3 bg-[#F7F5F2] text-warm-text text-sm font-semibold rounded-xl hover:bg-[#EBE8E1] active:bg-[#DDD9D0] transition-colors border border-warm-text/10"
              >
                View Code
              </a>
            )}

            {/* Secondary: Website (if provided) */}
            {websiteUrl && (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center min-h-[48px] sm:min-h-[44px] px-5 py-3 bg-[#F7F5F2] text-warm-text text-sm font-semibold rounded-xl hover:bg-[#EBE8E1] active:bg-[#DDD9D0] transition-colors border border-warm-text/10"
              >
                View Website
              </a>
            )}

            {/* Secondary: Artifact (if provided) */}
            {artifactUrl && (
              <a
                href={artifactUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center min-h-[48px] sm:min-h-[44px] px-5 py-3 bg-[#F7F5F2] text-warm-text text-sm font-semibold rounded-xl hover:bg-[#EBE8E1] active:bg-[#DDD9D0] transition-colors border border-warm-text/10"
              >
                View Artifact
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        videoUrl={videoUrl}
        projectName={projectName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
