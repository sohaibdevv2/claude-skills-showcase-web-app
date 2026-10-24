"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const schools = [
  "African Leadership University Rwanda",
  "Arizona State University Campus Immersion",
  "California Institute of Technology",
  "Carnegie Mellon University",
  "Champlain College",
  "Columbia University in the City of New York",
  "Cornell University",
  "Dartmouth College",
  "Duke University",
  "ETH Zurich",
  "Georgetown University",
  "Georgia Institute of Technology-Main Campus",
  "Harvard University",
  "Illinois Institute of Technology",
  "Imperial College London",
  "Indian Institute of Technology Madras",
  "Indiana University-Bloomington",
  "Johns Hopkins University",
  "Kwame Nkrumah University of Science & Technology",
  "London Business School",
  "Makerere University",
  "Massachusetts Institute of Technology",
  "McGill University",
  "Michigan State University",
  "Mila - Quebec Artificial Intelligence Institute",
  "Minnesota State University-Mankato",
  "New Jersey Institute of Technology",
  "New York University",
  "Northeastern University",
  "Northumbria University",
  "Northwestern University",
  "Ohio State University-Main Campus",
  "Pennsylvania State University-Main Campus",
  "Princeton University",
  "Purdue University-Main Campus",
  "Rice University",
  "Stanford University",
  "Syracuse University",
  "Technical University of Munich",
  "The London School of Economics and Political Science",
  "The University of Edinburgh",
  "The University of Texas at Austin",
  "Trinity College Dublin",
  "Université Cheikh Anta Diop de Dakar",
  "University College Cork",
  "University College London",
  "University of California-Berkeley",
  "University of California-Irvine",
  "University of California-Los Angeles",
  "University of California-San Diego",
  "University of Cambridge",
  "University of Cape Town",
  "University of Chicago",
  "University of Exeter",
  "University of Florida",
  "University of Georgia",
  "University of Ghana",
  "University of Illinois Urbana-Champaign",
  "University of Lagos",
  "University of Louisville",
  "University of Maryland-College Park",
  "University of Massachusetts-Amherst",
  "University of Michigan-Ann Arbor",
  "University of Missouri-Columbia",
  "University of Nairobi",
  "University of Nevada-Las Vegas",
  "University of North Carolina at Chapel Hill",
  "University of Oxford",
  "University of Pennsylvania",
  "University of Pittsburgh-Pittsburgh Campus",
  "University of Rwanda",
  "University of San Francisco",
  "University of Southern California",
  "University of Toronto St. George",
  "University of Victoria",
  "University of Virginia-Main Campus",
  "University of Washington-Seattle Campus",
  "University of Waterloo",
  "University of Wisconsin-Madison",
  "Vanderbilt University",
  "Yale University",
  "Other",
];

const tagOptions = [
  "productivity",
  "automation",
  "creative",
  "tool",
  "data analysis",
  "game",
];

interface FormData {
  projectName: string;
  builderName: string;
  school: string;
  customSchool: string;
  githubUrl?: string;
  websiteUrl?: string;
  artifactUrl?: string;
  videoUrl?: string;
  description: string;
  tags: string[];
}

interface FormErrors {
  projectName?: string;
  builderName?: string;
  school?: string;
  customSchool?: string;
  githubUrl?: string;
  websiteUrl?: string;
  artifactUrl?: string;
  videoUrl?: string;
  description?: string;
  tags?: string;
  projectLinks?: string;
}

// Helper function to normalize URLs - adds https:// if no protocol provided
const normalizeUrl = (urlString: string): string => {
  if (!urlString.trim()) return "";
  const trimmed = urlString.trim();
  // If URL doesn't start with http:// or https://, add https://
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export default function SubmitPage() {
  const [formData, setFormData] = useState<FormData>({
    projectName: "",
    builderName: "",
    school: "",
    customSchool: "",
    githubUrl: "",
    websiteUrl: "",
    artifactUrl: "",
    videoUrl: "",
    description: "",
    tags: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const validateField = (name: string, value: string | string[] | undefined): string | undefined => {
    switch (name) {
      case "projectName":
        if (!value || (value as string).trim() === "") {
          return "Project name is required";
        }
        if ((value as string).length > 100) {
          return "Project name must be 100 characters or less";
        }
        break;
      case "builderName":
        if (!value || (value as string).trim() === "") {
          return "Builder name is required";
        }
        if ((value as string).length > 50) {
          return "Builder name must be 50 characters or less";
        }
        break;
      case "school":
        if (!value || (value as string) === "") {
          return "Please select your school";
        }
        break;
      case "customSchool":
        if (formData.school === "Other") {
          if (!value || (value as string).trim() === "") {
            return "Please enter your school name";
          }
          if ((value as string).length > 100) {
            return "School name must be 100 characters or less";
          }
        }
        break;
      case "githubUrl":
        // Only validate if value is provided
        if (value && (value as string).trim() !== "") {
          try {
            const normalizedUrl = normalizeUrl((value as string));
            const url = new URL(normalizedUrl);
            if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
              return "Please enter a valid GitHub URL";
            }
            if (url.protocol !== 'https:') {
              return "GitHub URL must use HTTPS";
            }
            // Validate path format: /username/repo
            const pathParts = url.pathname.split('/').filter(p => p.length > 0);
            if (pathParts.length < 2) {
              return "Please enter a complete GitHub repository URL (github.com/username/repo)";
            }
          } catch {
            return "Please enter a valid URL";
          }
        }
        break;
      case "websiteUrl":
        if (value && (value as string).trim() !== "") {
          try {
            const normalizedUrl = normalizeUrl((value as string));
            new URL(normalizedUrl);
          } catch {
            return "Please enter a valid URL";
          }
        }
        break;
      case "artifactUrl":
        if (value && (value as string).trim() !== "") {
          try {
            const normalizedUrl = normalizeUrl((value as string));
            const url = new URL(normalizedUrl);
            if (url.hostname !== 'claude.ai') {
              return "Please enter a valid Claude artifact URL (claude.ai)";
            }
            if (!url.pathname.startsWith('/artifacts/')) {
              return "Artifact URL must be in format: claude.ai/artifacts/...";
            }
            if (url.protocol !== 'https:') {
              return "Artifact URL must use HTTPS";
            }
          } catch {
            return "Please enter a valid URL";
          }
        }
        break;
      case "videoUrl":
        // Video URL is optional - only validate if provided
        if (value && (value as string).trim() !== "") {
          try {
            const normalizedUrl = normalizeUrl((value as string));
            const url = new URL(normalizedUrl);
            const isYouTube = url.hostname === 'www.youtube.com' ||
                              url.hostname === 'youtube.com' ||
                              url.hostname === 'youtu.be';
            const isLoom = url.hostname === 'www.loom.com' ||
                           url.hostname === 'loom.com';

            if (!isYouTube && !isLoom) {
              return "Please enter a valid YouTube or Loom URL";
            }
            if (url.protocol !== 'https:' && url.protocol !== 'http:') {
              return "URL must use HTTP or HTTPS";
            }
          } catch {
            return "Please enter a valid URL";
          }
        }
        break;
      case "description":
        if (!value || (value as string).trim() === "") {
          return "Description is required";
        }
        if ((value as string).length < 50) {
          return `Description must be at least 50 characters (${50 - (value as string).length} more needed)`;
        }
        if ((value as string).length > 250) {
          return "Description must be 250 characters or less";
        }
        break;
      case "tags":
        if (!value || (value as string[]).length === 0) {
          return "Please select at least one tag";
        }
        break;
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    // Ensure at least one project link is provided
    const hasAtLeastOneLink =
      (formData.githubUrl && formData.githubUrl.trim() !== '') ||
      (formData.websiteUrl && formData.websiteUrl.trim() !== '') ||
      (formData.artifactUrl && formData.artifactUrl.trim() !== '');

    if (!hasAtLeastOneLink) {
      newErrors.projectLinks = "Please provide at least one project link (GitHub, Website, or Artifact)";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    // When school changes to "Other", mark customSchool as touched and validate
    if (name === "school") {
      if (value === "Other") {
        setTouched((prev) => ({ ...prev, customSchool: true }));
        const customSchoolError = validateField("customSchool", formData.customSchool);
        setErrors((prev) => ({ ...prev, customSchool: customSchoolError }));
      } else {
        // Clear customSchool errors when switching away from "Other"
        setErrors((prev) => ({ ...prev, customSchool: undefined }));
      }
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleTagChange = (tag: string) => {
    // Validate tag is in allowed list
    if (!tagOptions.includes(tag)) {
      console.error(`Invalid tag attempted: ${tag}`);
      return;
    }

    setTouched((prev) => ({ ...prev, tags: true }));
    const newTags = formData.tags.includes(tag)
      ? formData.tags.filter((t) => t !== tag)
      : [...formData.tags, tag];

    setFormData((prev) => ({ ...prev, tags: newTags }));
    const error = validateField("tags", newTags);
    setErrors((prev) => ({ ...prev, tags: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Prepare submission data with customSchool replacing "Other"
        const submissionData = {
          projectName: formData.projectName.trim(),
          builderName: formData.builderName.trim(),
          school: formData.school === "Other" ? formData.customSchool.trim() : formData.school,
          ...(formData.githubUrl && { githubUrl: normalizeUrl(formData.githubUrl) }),
          ...(formData.websiteUrl && { websiteUrl: normalizeUrl(formData.websiteUrl) }),
          ...(formData.artifactUrl && { artifactUrl: normalizeUrl(formData.artifactUrl) }),
          ...(formData.videoUrl && { videoUrl: normalizeUrl(formData.videoUrl) }),
          description: formData.description.trim(),
          tags: formData.tags,
        };

        // Call API endpoint to save submission
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Submission failed');
        }

        setIsSubmitting(false);
        setShowSuccessModal(true);

        // Reset form
        setFormData({
          projectName: "",
          builderName: "",
          school: "",
          customSchool: "",
          githubUrl: "",
          websiteUrl: "",
          artifactUrl: "",
          videoUrl: "",
          description: "",
          tags: [],
        });
        setErrors({});
        setTouched({});
      } catch (error) {
        console.error('Submission error:', error);
        setIsSubmitting(false);
        setErrors({
          ...errors,
          projectName: error instanceof Error ? error.message : 'Failed to submit build. Please try again.'
        });
      }
    }
  };

  const isFormValid = (): boolean => {
    const schoolValid =
      formData.school !== "" &&
      (formData.school !== "Other" || formData.customSchool.trim() !== "");

    // At least one project link must be provided and valid
    const hasGithub = !!(formData.githubUrl && formData.githubUrl.trim() !== '');
    const hasWebsite = !!(formData.websiteUrl && formData.websiteUrl.trim() !== '');
    const hasArtifact = !!(formData.artifactUrl && formData.artifactUrl.trim() !== '');

    let githubValid = true;
    if (hasGithub && formData.githubUrl) {
      try {
        const url = new URL(normalizeUrl(formData.githubUrl));
        githubValid = (url.hostname === 'github.com' || url.hostname === 'www.github.com') &&
                      url.protocol === 'https:' &&
                      url.pathname.split('/').filter(p => p.length > 0).length >= 2;
      } catch {
        githubValid = false;
      }
    }

    let websiteValid = true;
    if (hasWebsite && formData.websiteUrl) {
      try {
        new URL(normalizeUrl(formData.websiteUrl));
      } catch {
        websiteValid = false;
      }
    }

    let artifactValid = true;
    if (hasArtifact && formData.artifactUrl) {
      try {
        const url = new URL(normalizeUrl(formData.artifactUrl));
        artifactValid = url.hostname === 'claude.ai' &&
                       url.pathname.startsWith('/artifacts/') &&
                       url.protocol === 'https:';
      } catch {
        artifactValid = false;
      }
    }

    const hasAtLeastOneValidLink =
      (hasGithub && githubValid) ||
      (hasWebsite && websiteValid) ||
      (hasArtifact && artifactValid);

    // Validate video URL - optional, only validate if provided
    let videoValid = true;
    if (formData.videoUrl && formData.videoUrl.trim() !== '') {
      try {
        const videoUrl = new URL(normalizeUrl(formData.videoUrl));
        const isYouTube = videoUrl.hostname === 'www.youtube.com' ||
                          videoUrl.hostname === 'youtube.com' ||
                          videoUrl.hostname === 'youtu.be';
        const isLoom = videoUrl.hostname === 'www.loom.com' ||
                       videoUrl.hostname === 'loom.com';
        videoValid = (isYouTube || isLoom) &&
                     (videoUrl.protocol === 'https:' || videoUrl.protocol === 'http:');
      } catch {
        videoValid = false;
      }
    }

    return (
      formData.projectName.trim() !== "" &&
      formData.builderName.trim() !== "" &&
      schoolValid &&
      hasAtLeastOneValidLink &&
      videoValid &&
      formData.description.length >= 50 &&
      formData.description.length <= 250 &&
      formData.tags.length > 0
    );
  };

  const getInvalidReasons = (): string[] => {
    const reasons: string[] = [];
    if (formData.projectName.trim() === "") reasons.push("Project name");
    if (formData.builderName.trim() === "") reasons.push("Builder name");
    if (formData.school === "") {
      reasons.push("School");
    } else if (formData.school === "Other" && formData.customSchool.trim() === "") {
      reasons.push("Custom school name");
    }

    // Check if at least one project link is provided
    const hasGithub = formData.githubUrl && formData.githubUrl.trim() !== '';
    const hasWebsite = formData.websiteUrl && formData.websiteUrl.trim() !== '';
    const hasArtifact = formData.artifactUrl && formData.artifactUrl.trim() !== '';

    if (!hasGithub && !hasWebsite && !hasArtifact) {
      reasons.push("At least one project link (GitHub/Website/Artifact)");
    } else {
      // Validate each provided link
      if (hasGithub && formData.githubUrl) {
        try {
          const url = new URL(normalizeUrl(formData.githubUrl));
          if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') {
            reasons.push("Valid GitHub URL");
          } else if (url.protocol !== 'https:') {
            reasons.push("GitHub URL must use HTTPS");
          } else if (url.pathname.split('/').filter(p => p.length > 0).length < 2) {
            reasons.push("Complete GitHub repo URL");
          }
        } catch {
          reasons.push("Valid GitHub URL");
        }
      }

      if (hasWebsite && formData.websiteUrl) {
        try {
          new URL(normalizeUrl(formData.websiteUrl));
        } catch {
          reasons.push("Valid website URL");
        }
      }

      if (hasArtifact && formData.artifactUrl) {
        try {
          const url = new URL(normalizeUrl(formData.artifactUrl));
          if (url.hostname !== 'claude.ai' || !url.pathname.startsWith('/artifacts/')) {
            reasons.push("Valid Claude artifact URL");
          }
        } catch {
          reasons.push("Valid artifact URL");
        }
      }
    }

    // Validate video URL - only if provided
    if (formData.videoUrl && formData.videoUrl.trim() !== '') {
      try {
        const videoUrl = new URL(normalizeUrl(formData.videoUrl));
        const isYouTube = videoUrl.hostname === 'www.youtube.com' ||
                          videoUrl.hostname === 'youtube.com' ||
                          videoUrl.hostname === 'youtu.be';
        const isLoom = videoUrl.hostname === 'www.loom.com' ||
                       videoUrl.hostname === 'loom.com';
        if (!isYouTube && !isLoom) {
          reasons.push("Valid YouTube or Loom URL");
        } else if (videoUrl.protocol !== 'https:' && videoUrl.protocol !== 'http:') {
          reasons.push("Valid video URL protocol");
        }
      } catch {
        reasons.push("Valid video URL");
      }
    }

    if (formData.description.length < 50) reasons.push("Description (50+ chars)");
    if (formData.tags.length === 0) reasons.push("At least one tag");
    return reasons;
  };

  const getDescriptionCounterColor = (): string => {
    const len = formData.description.length;
    if (len === 0) return "text-warm-text/40";
    if (len < 50) return "text-amber-500";
    if (len > 250) return "text-red-500";
    if (len > 220) return "text-amber-500";
    return "text-warm-green";
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showSuccessModal) {
        setShowSuccessModal(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showSuccessModal]);

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Header */}
      <header className="bg-warm-bg border-b border-warm-text/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-serif text-warm-text">Claude</span>
              <span className="text-xl sm:text-2xl font-serif text-warm-text/70">Showcase</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 text-sm font-medium text-warm-coral hover:text-warm-coral/80 transition-colors"
              >
                Gallery
              </Link>
              <span className="px-4 sm:px-5 py-2.5 text-sm font-semibold bg-warm-text/10 text-warm-text/60 rounded-xl cursor-default">
                Submit Build
              </span>
            </nav>
          </div>
        </div>
      </header>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-warm-text/40 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 sm:p-10 max-w-md w-full animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-2 text-warm-text/40 hover:text-warm-text transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center">
              <div className="w-20 h-20 bg-warm-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-warm-green"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-warm-text mb-3">
                Submission Received!
              </h2>
              <p className="text-warm-text/70 font-sans mb-8 leading-relaxed">
                Thanks! Your submission is under review.<br />
                We&apos;ll add it to the showcase soon.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3.5 min-h-[48px] bg-warm-coral text-white font-semibold rounded-xl hover:bg-[#c47a5f] active:bg-[#b86f55] transition-colors"
                >
                  Submit Another
                </button>
                <Link
                  href="/"
                  className="flex-1 px-6 py-3.5 min-h-[48px] bg-[#F7F5F2] text-warm-text font-semibold rounded-xl hover:bg-[#EBE8E1] active:bg-[#DDD9D0] transition-colors border border-warm-text/10 text-center"
                >
                  View Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-warm-text mb-3">
            Submit Your Build
          </h1>
          <p className="text-base sm:text-lg text-warm-text/70 font-sans">
            Share your Claude Code project with the community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg shadow-warm-text/5 p-5 sm:p-8"
        >
          <div className="space-y-5 sm:space-y-6">
            {/* Project Name */}
            <div>
              <label
                htmlFor="projectName"
                className="block text-sm font-semibold text-warm-text mb-2"
              >
                Project Name <span className="text-warm-coral">*</span>
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={100}
                placeholder="My Awesome Claude Project"
                className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl placeholder:text-warm-text/40 focus:outline-none transition-colors ${
                  errors.projectName && touched.projectName
                    ? "border-red-400 focus:border-red-400"
                    : "border-transparent focus:border-warm-coral"
                }`}
              />
              {errors.projectName && touched.projectName && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.projectName}
                </p>
              )}
            </div>

            {/* Builder Name */}
            <div>
              <label
                htmlFor="builderName"
                className="block text-sm font-semibold text-warm-text mb-2"
              >
                Builder Name <span className="text-warm-coral">*</span>
              </label>
              <input
                type="text"
                id="builderName"
                name="builderName"
                value={formData.builderName}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={50}
                placeholder="Your name"
                className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl placeholder:text-warm-text/40 focus:outline-none transition-colors ${
                  errors.builderName && touched.builderName
                    ? "border-red-400 focus:border-red-400"
                    : "border-transparent focus:border-warm-coral"
                }`}
              />
              {errors.builderName && touched.builderName && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.builderName}
                </p>
              )}
            </div>

            {/* School */}
            <div>
              <label
                htmlFor="school"
                className="block text-sm font-semibold text-warm-text mb-2"
              >
                School <span className="text-warm-coral">*</span>
              </label>
              <div className="relative">
                <select
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl focus:outline-none transition-colors appearance-none cursor-pointer pr-10 ${
                    errors.school && touched.school
                      ? "border-red-400 focus:border-red-400"
                      : "border-transparent focus:border-warm-coral"
                  } ${formData.school === "" ? "text-warm-text/40" : ""}`}
                >
                  <option value="" disabled>
                    Select your school
                  </option>
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-warm-text/40 pointer-events-none"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              {errors.school && touched.school && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.school}
                </p>
              )}

              {/* Custom School Input - shown when "Other" is selected */}
              {formData.school === "Other" && (
                <div className="mt-4">
                  <label
                    htmlFor="customSchool"
                    className="block text-sm font-semibold text-warm-text mb-2"
                  >
                    Your School <span className="text-warm-coral">*</span>
                  </label>
                  <input
                    type="text"
                    id="customSchool"
                    name="customSchool"
                    value={formData.customSchool}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={100}
                    placeholder="Enter your school name"
                    className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl placeholder:text-warm-text/40 focus:outline-none transition-colors ${
                      errors.customSchool && touched.customSchool
                        ? "border-red-400 focus:border-red-400"
                        : "border-transparent focus:border-warm-coral"
                    }`}
                  />
                  {errors.customSchool && touched.customSchool && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.customSchool}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* GitHub URL */}
            <div>
              <label
                htmlFor="githubUrl"
                className="block text-sm font-semibold text-warm-text mb-2"
              >
                GitHub URL
              </label>
              <input
                type="url"
                id="githubUrl"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://github.com/username/repo"
                className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl placeholder:text-warm-text/40 focus:outline-none transition-colors ${
                  errors.githubUrl && touched.githubUrl
                    ? "border-red-400 focus:border-red-400"
                    : "border-transparent focus:border-warm-coral"
                }`}
              />
              {errors.githubUrl && touched.githubUrl && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.githubUrl}
                </p>
              )}
            </div>

            {/* Website URL */}
            <div>
              <label
                htmlFor="websiteUrl"
                className="block text-sm font-semibold text-warm-text mb-2"
              >
                Website URL
              </label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://myproject.com"
                className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl placeholder:text-warm-text/40 focus:outline-none transition-colors ${
                  errors.websiteUrl && touched.websiteUrl
                    ? "border-red-400 focus:border-red-400"
                    : "border-transparent focus:border-warm-coral"
                }`}
              />
              {errors.websiteUrl && touched.websiteUrl && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.websiteUrl}
                </p>
              )}
            </div>

            {/* Artifact URL */}
            <div>
              <label
                htmlFor="artifactUrl"
                className="block text-sm font-semibold text-warm-text mb-2"
              >
                Claude Artifact URL
              </label>
              <input
                type="url"
                id="artifactUrl"
                name="artifactUrl"
                value={formData.artifactUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://claude.ai/artifacts/..."
                className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl placeholder:text-warm-text/40 focus:outline-none transition-colors ${
                  errors.artifactUrl && touched.artifactUrl
                    ? "border-red-400 focus:border-red-400"
                    : "border-transparent focus:border-warm-coral"
                }`}
              />
              {errors.artifactUrl && touched.artifactUrl ? (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.artifactUrl}
                </p>
              ) : (
                <p className="mt-2 text-sm text-warm-text/50">
                  At least one project link is required (GitHub, Website, or Artifact)
                </p>
              )}
            </div>

            {/* Video Demo URL */}
            <div>
              <label
                htmlFor="videoUrl"
                className="block text-sm font-semibold text-warm-text mb-2"
              >
                Video Demo URL <span className="text-warm-text/50 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                id="videoUrl"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="https://youtube.com/watch?v=..."
                className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl placeholder:text-warm-text/40 focus:outline-none transition-colors ${
                  errors.videoUrl && touched.videoUrl
                    ? "border-red-400 focus:border-red-400"
                    : "border-transparent focus:border-warm-coral"
                }`}
              />
              {errors.videoUrl && touched.videoUrl ? (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.videoUrl}
                </p>
              ) : (
                <p className="mt-2 text-sm text-warm-text/50">
                  Paste your YouTube or Loom link
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-warm-text"
                >
                  Description <span className="text-warm-coral">*</span>
                </label>
                <span className={`text-sm font-medium transition-colors ${getDescriptionCounterColor()}`}>
                  {formData.description.length}/250
                </span>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                placeholder="Describe your project in 2-3 sentences. What does it do? What problem does it solve?"
                className={`w-full px-4 py-3.5 text-base text-warm-text bg-warm-bg border-2 rounded-xl placeholder:text-warm-text/40 focus:outline-none transition-colors resize-none ${
                  errors.description && touched.description
                    ? "border-red-400 focus:border-red-400"
                    : "border-transparent focus:border-warm-coral"
                }`}
              />
              <div className="mt-2 flex items-start justify-between gap-4">
                {errors.description && touched.description ? (
                  <p className="text-sm text-red-500 flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-sm text-warm-text/50">
                    {formData.description.length < 50
                      ? `${50 - formData.description.length} more characters needed`
                      : "Looking good!"}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-warm-text mb-3">
                Tags <span className="text-warm-coral">*</span>
                <span className="font-normal text-warm-text/50 ml-2">Select all that apply</span>
              </label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {tagOptions.map((tag) => {
                  const isSelected = formData.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagChange(tag)}
                      className={`px-4 sm:px-5 py-3 text-sm font-medium rounded-full transition-all duration-200 min-h-[48px] ${
                        isSelected
                          ? "bg-warm-coral text-white shadow-sm"
                          : "bg-warm-bg text-warm-text hover:bg-[#E5E2DB] active:bg-[#DDD9D0]"
                      }`}
                    >
                      {isSelected && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1.5 -mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {tag}
                    </button>
                  );
                })}
              </div>
              {errors.tags && touched.tags && (
                <p className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.tags}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4 relative">
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                onMouseEnter={() => !isFormValid() && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={`w-full py-4 min-h-[56px] text-base font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                  isFormValid() && !isSubmitting
                    ? "bg-warm-coral text-white hover:bg-[#c47a5f] active:bg-[#b86f55] shadow-md"
                    : "bg-warm-text/10 text-warm-text/40 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Build"
                )}
              </button>

              {/* Tooltip */}
              {showTooltip && !isFormValid() && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-4 py-3 bg-warm-text text-white text-sm rounded-xl shadow-lg w-64 z-10">
                  <p className="font-medium mb-1.5">Missing required fields:</p>
                  <ul className="text-white/80 text-xs space-y-0.5">
                    {getInvalidReasons().map((reason) => (
                      <li key={reason}>• {reason}</li>
                    ))}
                  </ul>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                    <div className="border-8 border-transparent border-t-warm-text"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
