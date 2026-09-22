const DEFAULT_MANIFEST_URL = '/assets/manifest.json';

export class AssetManager {
  constructor(options = {}) {
    this.manifestUrl = options.manifestUrl || DEFAULT_MANIFEST_URL;
    this.manifest = { version: 1, images: {}, spritesheets: {} };
    this.images = new Map();
    this.statuses = new Map();
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
      return Promise.reject(new Error(`Image loading is unavailable for asset: ${key}`));
    }

    this.statuses.set(key, 'loading');

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
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
      };
      image.onerror = () => {
        this.statuses.set(key, 'error');
        reject(new Error(`Image asset failed to load: ${key}`));
      };
      image.src = source;
    });
  }

  removeSolidBackground(image, background = 'light') {
    if (typeof document === 'undefined') return image;

    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
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

      if (background === 'dark' && darkness <= 18) {
        pixels.data[index + 3] = 0;
      } else if (background === 'dark' && darkness <= 38 && Math.max(red, green, blue) - Math.min(red, green, blue) < 18) {
        pixels.data[index + 3] = Math.round((38 - darkness) / 20 * 255);
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
    if (!source || typeof document === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = region.width;
    canvas.height = region.height;
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.drawImage(source, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
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

  isReady() {
    return this.manifestStatus === 'ready';
  }
}

export function createAssetManager(options) {
  return new AssetManager(options);
}