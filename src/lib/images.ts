const SANITY_HOST = 'cdn.sanity.io';

export interface OptimizeImageOptions {
  width: number;
  quality?: number;
}

export function optimizeImageUrl(url: string, options: OptimizeImageOptions): string {
  if (!url || url.startsWith('/')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== SANITY_HOST) {
      return url;
    }

    parsed.searchParams.set('w', String(options.width));
    parsed.searchParams.set('q', String(options.quality ?? 70));
    parsed.searchParams.set('auto', 'format');
    parsed.searchParams.set('fit', 'max');
    return parsed.toString();
  } catch {
    return url;
  }
}

export function imageSrcSet(url: string, widths: number[]): string {
  return widths.map((width) => `${optimizeImageUrl(url, { width })} ${width}w`).join(', ');
}

export interface ImageSize {
  width: number;
  height: number;
}

export function sanityImageDimensions(url: string): ImageSize | undefined {
  if (!url || url.startsWith('/')) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== SANITY_HOST) {
      return undefined;
    }

    const match = parsed.pathname.match(/-(\d+)x(\d+)\.[a-z0-9]+$/i);
    if (!match) {
      return undefined;
    }

    return { width: Number(match[1]), height: Number(match[2]) };
  } catch {
    return undefined;
  }
}

export function resolveImgSize(
  src: string,
  requested: { width?: number; height?: number } = {},
  intrinsic?: ImageSize,
): { width?: number; height?: number } {
  const source = intrinsic ?? sanityImageDimensions(src);

  if (source && requested.width) {
    return {
      width: requested.width,
      height: Math.round((source.height / source.width) * requested.width),
    };
  }

  if (source) {
    return source;
  }

  return { width: requested.width, height: requested.height };
}
