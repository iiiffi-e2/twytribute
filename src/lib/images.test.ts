import { describe, expect, it } from 'vitest';
import { imageSrcSet, optimizeImageUrl, resolveImgSize, sanityImageDimensions } from './images';

const sanityUrl =
  'https://cdn.sanity.io/images/abc123/production/photo-2000x3000.jpg';

describe('optimizeImageUrl', () => {
  it('leaves site-relative paths unchanged', () => {
    expect(optimizeImageUrl('/assets/twy-live1.jpg', { width: 800 })).toBe('/assets/twy-live1.jpg');
  });

  it('adds width, quality, and auto-format params to Sanity CDN URLs', () => {
    const result = optimizeImageUrl(sanityUrl, { width: 800, quality: 70 });
    const parsed = new URL(result);

    expect(parsed.searchParams.get('w')).toBe('800');
    expect(parsed.searchParams.get('q')).toBe('70');
    expect(parsed.searchParams.get('auto')).toBe('format');
    expect(parsed.searchParams.get('fit')).toBe('max');
  });

  it('leaves non-Sanity remote URLs unchanged', () => {
    const remote = 'https://img.youtube.com/vi/abc/maxresdefault.jpg';
    expect(optimizeImageUrl(remote, { width: 640 })).toBe(remote);
  });

  it('returns empty values as-is', () => {
    expect(optimizeImageUrl('', { width: 800 })).toBe('');
  });
});

describe('sanityImageDimensions', () => {
  it('reads width and height from a Sanity CDN filename', () => {
    expect(sanityImageDimensions(`${sanityUrl}`)).toEqual({ width: 2000, height: 3000 });
    expect(
      sanityImageDimensions(
        'https://cdn.sanity.io/images/abc/production/photo-1343x755.jpg?w=800',
      ),
    ).toEqual({ width: 1343, height: 755 });
  });

  it('returns undefined for non-Sanity or unparseable URLs', () => {
    expect(sanityImageDimensions('/assets/live-crowd.jpg')).toBeUndefined();
    expect(sanityImageDimensions('https://img.youtube.com/vi/abc/maxresdefault.jpg')).toBeUndefined();
  });
});

describe('resolveImgSize', () => {
  it('keeps the intrinsic aspect ratio instead of a fake height', () => {
    expect(
      resolveImgSize('https://cdn.sanity.io/images/abc/production/crowd-1343x755.jpg', {
        width: 800,
        height: 1000,
      }),
    ).toEqual({ width: 800, height: 450 });
  });

  it('uses local metadata over requested height', () => {
    expect(
      resolveImgSize('/assets/live-crowd.jpg', { width: 800, height: 1000 }, { width: 1343, height: 755 }),
    ).toEqual({ width: 800, height: 450 });
  });

  it('passes through requested size when no intrinsic size is known', () => {
    expect(resolveImgSize('/assets/unknown.jpg', { width: 800, height: 1000 })).toEqual({
      width: 800,
      height: 1000,
    });
  });
});

describe('imageSrcSet', () => {
  it('builds a width-descriptor srcset for Sanity images', () => {
    const srcset = imageSrcSet(sanityUrl, [480, 800]);

    expect(srcset).toContain('480w');
    expect(srcset).toContain('800w');
    expect(srcset.split(',').length).toBe(2);
    expect(srcset).toContain('w=480');
    expect(srcset).toContain('w=800');
  });
});
