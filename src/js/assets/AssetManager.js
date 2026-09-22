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
        this.images.set(key, image);
        this.statuses.set(key, 'ready');
        resolve(image);
      };
      image.onerror = () => {
        this.statuses.set(key, 'error');
        reject(new Error(`Image asset failed to load: ${key}`));
      };
      image.src = source;
    });
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