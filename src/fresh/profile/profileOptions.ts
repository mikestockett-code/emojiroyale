import type { FreshProfileColor } from './types';

export const FRESH_PROFILE_AVATARS = ['😀', '😎', '🥳', '🔥', '👑', '🌈', '🐶', '⭐', '⚡', '🦄'];

export const FRESH_PROFILE_COLORS: Record<FreshProfileColor, { label: string; swatch: string; bg: string }> = {
  sunset: { label: 'Sunset', swatch: '#f97316', bg: '#ffedd5' },
  ocean: { label: 'Ocean', swatch: '#2563eb', bg: '#dbeafe' },
  mint: { label: 'Mint', swatch: '#059669', bg: '#d1fae5' },
  violet: { label: 'Violet', swatch: '#7c3aed', bg: '#ede9fe' },
  ember: { label: 'Ember', swatch: '#dc2626', bg: '#fee2e2' },
  slate: { label: 'Slate', swatch: '#334155', bg: '#e2e8f0' },
};
