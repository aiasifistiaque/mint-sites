import type { Theme } from '@/types';
import { bistro } from './bistro';
import { bright } from './bright';
import { calm } from './calm';
import { editorial } from './editorial';
import { market } from './market';
import { mono } from './mono';
import { studio } from './studio';

export const THEMES: Theme[] = [studio, editorial, bright, market, calm, mono, bistro];
export const DEFAULT_THEME = 'studio';

export const getTheme = (key?: string | null): Theme =>
	THEMES.find(t => t.key === key) || THEMES.find(t => t.key === DEFAULT_THEME)!;
