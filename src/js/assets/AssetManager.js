const DEFAULT_MANIFEST_URL = './assets/manifest.json';

export class AssetManager {
  constructor(options = {}) {
    this.manifestUrl = options.manifestUrl || DEFAULT_MANIFEST_URL;
    this.manifest = { version: 1, images: {}, spritesheets: {} };
    this.images = new Map();
    this.statuses = new Map();
    this.regionCache = new Map();
    this.manifestStatus = 'idle';
  }

  async loadManifest(url = this.manifestUrl) {
    this.manifestStatus = 'loading';

    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (!response.ok) {
        throw new Error(`Asset manifest request failed: ${response.status}`);
      }

      const manifest = await response.json();
      this.manifest = {
        version: manifest.version || 1,
        images: manifest.images || {},
        spritesheets: manifest.spritesheets || {}
      };
      this.manifestStatus = 'ready';
      return this.manifest;
    } catch (error) {
      this.manifestStatus = 'error';
      throw error;
    }
  }

  async preload() {
    const entries = Object.entries(this.manifest.images);
    await Promise.all(entries.map(([key, source]) => this.loadImage(key, source)));
    return this.images;
  }

  loadImage(key, source) {
    if (this.images.has(key)) {
      return Promise.resolve(this.images.get(key));
    }

    if (typeof Image === 'undefined') {
      this.statuses.set(key, 'unsupported');
      return Promise.resolve(null);
    }

    this.statuses.set(key, 'loading');

    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        try {
          const processedImage = key === 'toy-room-player-sheet'
            ? this.removeSolidBackground(image)
            : key === 'toy-room-environment-sheet'
              ? this.removeSolidBackground(image, 'dark')
            : key === 'toy-room-player-back-sheet'
              ? this.normalizeCharacterPalette(image)
              : image;
          this.images.set(key, processedImage);
          this.statuses.set(key, 'ready');
          resolve(processedImage);
        } catch {
          this.statuses.set(key, 'error');
          resolve(null);
        }
      };
      image.onerror = () => {
        this.statuses.set(key, 'error');
        // Permite fallback gracioso sem rejeitar a promessa geral de pré-carregamento
        resolve(null);
      };
      image.src = source;
    });
  }

  removeSolidBackground(image, background = 'light') {
    if (typeof document === 'undefined') return image;

    const width = image.naturalWidth || image.width || 0;
    const height = image.naturalHeight || image.height || 0;
    if (width <= 0 || height <= 0) return image;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return image;

    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let index = 0; index < pixels.data.length; index += 4) {
      const red = pixels.data[index];
      const green = pixels.data[index + 1];
      const blue = pixels.data[index + 2];
      const whiteness = Math.min(red, green, blue);
      const darkness = Math.max(red, green, blue);

      if (background === 'dark' && darkness <= 20) {
        pixels.data[index + 3] = 0;
      } else if (background === 'dark' && darkness <= 38 && Math.max(red, green, blue) - Math.min(red, green, blue) < 18) {
        pixels.data[index + 3] = Math.round((darkness - 20) / 18 * 255);
      } else if (whiteness >= 245) {
        pixels.data[index + 3] = 0;
      } else if (whiteness >= 220 && Math.max(red, green, blue) - whiteness < 18) {
        pixels.data[index + 3] = Math.round((245 - whiteness) / 25 * 255);
      }
    }
    context.putImageData(pixels, 0, 0);
    return canvas;
  }

  getRegion(key, region) {
    const source = this.images.get(key);
    if (!source || typeof document === 'undefined' || !region) return null;

    const sourceWidth = source.naturalWidth || source.width || 0;
    const sourceHeight = source.naturalHeight || source.height || 0;
    if (sourceWidth <= 0 || sourceHeight <= 0) return null;

    const rx = region.x || 0;
    const ry = region.y || 0;
    const rw = region.width;
    const rh = region.height;

    if (!rw || !rh || rw <= 0 || rh <= 0) return null;
    if (rx < 0 || ry < 0 || rx >= sourceWidth || ry >= sourceHeight) return null;
    if (rx + rw > sourceWidth || ry + rh > sourceHeight) return null;

    const cacheKey = `${key}:${rx},${ry},${rw},${rh}`;
    if (this.regionCache.has(cacheKey)) {
      return this.regionCache.get(cacheKey);
    }

    const canvas = document.createElement('canvas');
    canvas.width = rw;
    canvas.height = rh;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.drawImage(source, rx, ry, rw, rh, 0, 0, rw, rh);

    this.regionCache.set(cacheKey, canvas);
    return canvas;
  }

  normalizeCharacterPalette(image) {
    if (typeof document === 'undefined') return image;

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return image;

    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const lift = 0.1;
    for (let index = 0; index < pixels.data.length; index += 4) {
      if (pixels.data[index + 3] === 0) continue;
      pixels.data[index] += Math.round((255 - pixels.data[index]) * lift);
      pixels.data[index + 1] += Math.round((255 - pixels.data[index + 1]) * lift);
      pixels.data[index + 2] += Math.round((255 - pixels.data[index + 2]) * lift);
    }
    context.putImageData(pixels, 0, 0);
    return canvas;
  }

  get(key) {
    return this.images.get(key) || null;
  }

  has(key) {
    return this.images.has(key);
  }

  getStatus(key) {
    return this.statuses.get(key) || 'missing';
  }

  isReady(key) {
    if (key) {
      return this.statuses.get(key) === 'ready' && !!this.images.get(key);
    }
    return this.manifestStatus === 'ready';
  }

  clearRegionCache() {
    this.regionCache.clear();
  }
}

export function createAssetManager(options) {
  return new AssetManager(options);
}