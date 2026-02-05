"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

const DEFAULT_TAGS = [
  { id: "high-protein", label: "High Protein" },
  { id: "best-ratio", label: "Best Ratio" },
  { id: "lowest-cal", label: "Lowest Cal" },
];

type TagOption = {
  id: string;
  label: string;
};

type RestaurantHeaderProps = {
  name: string;
  logo: string;
  subtitle?: string;
  brandColor: string;
  tags?: TagOption[];
  initialActiveTag?: string;
  onTagChange?: (tagId: string) => void;
};

function hexToRgb(color: string) {
  const normalized = color.replace("#", "").trim();
  if (normalized.length === 3) {
    const [r, g, b] = normalized.split("");
    return `${parseInt(`${r}${r}`, 16)} ${parseInt(`${g}${g}`, 16)} ${parseInt(
      `${b}${b}`,
      16,
    )}`;
  }
  if (normalized.length === 6) {
    const r = normalized.slice(0, 2);
    const g = normalized.slice(2, 4);
    const b = normalized.slice(4, 6);
    return `${parseInt(r, 16)} ${parseInt(g, 16)} ${parseInt(b, 16)}`;
  }
  return null;
}

export default function RestaurantHeader({
  name,
  logo,
  subtitle = "Find the best & smartest high-protein items on the menu.",
  brandColor,
  tags = DEFAULT_TAGS,
  initialActiveTag,
  onTagChange,
}: RestaurantHeaderProps) {
  const resolvedRgb = useMemo(
    () => hexToRgb(brandColor) ?? "59 130 246",
    [brandColor],
  );

  const [activeTag, setActiveTag] = useState(
    initialActiveTag ?? tags[0]?.id ?? "",
  );

  const handleTagClick = (tagId: string) => {
    setActiveTag(tagId);
    onTagChange?.(tagId);
  };

  return (
    <header
      className="border-b border-slate-200/80 bg-[linear-gradient(to_bottom,rgba(var(--brand-rgb),0.08),rgba(var(--brand-rgb),0.02),white)]"
      style={{ "--brand-rgb": resolvedRgb } as CSSProperties}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-10 pt-8">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <span className="text-base">←</span>
            Back to home
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <Image
                src={logo}
                alt={`${name} logo`}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                {name}
              </h1>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isActive = tag.id === activeTag;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagClick(tag.id)}
                aria-pressed={isActive}
                className={
                  "rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/60 " +
                  (isActive
                    ? "border-black bg-black text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900")
                }
              >
                {tag.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
