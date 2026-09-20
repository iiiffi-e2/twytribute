import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const globalCss = readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8');
const baseLayout = readFileSync(resolve(process.cwd(), 'src/layouts/BaseLayout.astro'), 'utf8');

describe('font loading', () => {
  it('uses font-display swap so late stylesheets still apply Oswald', () => {
    const displays = [...globalCss.matchAll(/(?<!-)font-display:\s*([^;]+);/g)].map((match) =>
      match[1].trim(),
    );

    expect(displays.length).toBeGreaterThan(0);
    expect(displays.every((value) => value === 'swap')).toBe(true);
    expect(globalCss).not.toContain('font-display: optional');
  });

  it('preloads both Oswald weights used by display headings', () => {
    expect(globalCss).toMatch(/font-family:\s*'Oswald'[\s\S]*?font-weight:\s*600/);
    expect(globalCss).toMatch(/font-family:\s*'Oswald'[\s\S]*?font-weight:\s*700/);
    expect(baseLayout).toContain('/fonts/oswald.woff2');
    expect(baseLayout).toContain('/fonts/oswald-700.woff2');
  });
});
