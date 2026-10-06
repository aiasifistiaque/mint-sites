import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	resolve: { alias: { '@': path.join(__dirname, 'src') } },
	test: { include: ['test/**/*.test.ts', 'test/**/*.test.tsx'], environment: 'node' },
});
