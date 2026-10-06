import type { Theme } from '@/types';
import { studio } from './studio';

export const THEMES: Theme[] = [studio];
export const DEFAULT_THEME = 'studio';

export const getTheme = (key?: string | null): Theme =>
	THEMES.find(t => t.key === key) || THEMES.find(t => t.key === DEFAULT_THEME)!;
