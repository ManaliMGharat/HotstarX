import React from 'react';

/**
 * PrimeX Elegant Image Fallbacks
 * High-definition themed SVG Data URIs that never fail or trigger network errors.
 */

export const FALLBACK_POSTER = 
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1200' viewBox='0 0 800 1200'%3E%3Cdefs%3E%3ClinearGradient id='bgP' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23070e1c'/%3E%3Cstop offset='100%25' stop-color='%23030712'/%3E%3C/linearGradient%3E%3ClinearGradient id='accentP' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300F2FE'/%3E%3Cstop offset='100%25' stop-color='%238B5CF6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bgP)'/%3E%3Ccircle cx='400' cy='520' r='90' fill='%2300F2FE' fill-opacity='0.12'/%3E%3Cpolygon points='380,480 440,520 380,560' fill='url(%23accentP)'/%3E%3Ctext x='400' y='670' font-family='system-ui, -apple-system, sans-serif' font-size='32' font-weight='800' fill='%23FFFFFF' text-anchor='middle' letter-spacing='2'%3EPrimeX%3C/text%3E%3Ctext x='400' y='710' font-family='system-ui, -apple-system, sans-serif' font-size='16' font-weight='500' fill='%2364748B' text-anchor='middle'%3EMedia Stream Preview%3C/text%3E%3C/svg%3E";

export const FALLBACK_BACKDROP = 
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='bgB' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23070e1c'/%3E%3Cstop offset='100%25' stop-color='%23030712'/%3E%3C/linearGradient%3E%3ClinearGradient id='accentB' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300F2FE'/%3E%3Cstop offset='100%25' stop-color='%238B5CF6'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23bgB)'/%3E%3Ccircle cx='960' cy='500' r='110' fill='%2300F2FE' fill-opacity='0.12'/%3E%3Cpolygon points='935,450 1005,500 935,550' fill='url(%23accentB)'/%3E%3Ctext x='960' y='680' font-family='system-ui, -apple-system, sans-serif' font-size='38' font-weight='800' fill='%23FFFFFF' text-anchor='middle' letter-spacing='3'%3EPrimeX Cinema%3C/text%3E%3Ctext x='960' y='730' font-family='system-ui, -apple-system, sans-serif' font-size='18' font-weight='500' fill='%2364748B' text-anchor='middle'%3EContent Preview Available in HD%3C/text%3E%3C/svg%3E";

/**
 * Image error handler that replaces a failing remote URL with the fallback SVG
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  isPortrait: boolean = true
): void {
  const target = event.currentTarget;
  target.onerror = null; // Prevent loop if fallback itself had issues
  target.src = isPortrait ? FALLBACK_POSTER : FALLBACK_BACKDROP;
}
