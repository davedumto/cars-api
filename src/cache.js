class MemoryCache {
  constructor(ttlMs) {
    this.ttlMs = ttlMs;
    this.entries = new Map();
  }

  get(key) {
    const entry = this.entries.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.entries.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key, value) {
    this.entries.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs
    });
  }
}

module.exports = {
  MemoryCache
};
