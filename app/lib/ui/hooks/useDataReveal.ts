"use client";

import { useEffect } from "react";

/**
 * Sets up IntersectionObserver for elements with `data-reveal` attribute.
 * Adds `.revealed` class when elements enter the viewport.
 * Requires the corresponding CSS in globals.css.
 */
export function useDataReveal(options?: { threshold?: number; rootMargin?: string }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: options?.threshold ?? 0.1, rootMargin: options?.rootMargin }
    );

    const timer = setTimeout(() => {
      document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
