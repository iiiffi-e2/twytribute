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
