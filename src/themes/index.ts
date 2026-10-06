import type { Theme } from '@/types';
import { bright } from './bright';
import { editorial } from './editorial';
import { studio } from './studio';

export const THEMES: Theme[] = [studio, editorial, bright];
export const DEFAULT_THEME = 'studio';

export const getTheme = (key?: string | null): Theme =>
	THEMES.find(t => t.key === key) || THEMES.find(t => t.key === DEFAULT_THEME)!;
