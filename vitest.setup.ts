import "@testing-library/jest-dom/vitest";

const storage = new Map<string, string>();

const localStorageMock: Storage = {
  getItem: (key) => storage.get(String(key)) ?? null,
  setItem: (key, value) => storage.set(String(key), String(value)),
  removeItem: (key) => storage.delete(String(key)),
  clear: () => storage.clear(),
  key: (index) => Array.from(storage.keys())[index] ?? null,
  get length() {
    return storage.size;
  },
};

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: localStorageMock,
});

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: localStorageMock,
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class IntersectionObserverMock {
  root = null;
  rootMargin = "";
  thresholds = [0];

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

Object.defineProperty(globalThis, "ResizeObserver", {
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(globalThis, "IntersectionObserver", {
  configurable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(window, "ResizeObserver", {
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(window, "IntersectionObserver", {
  configurable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(Element.prototype, "scrollIntoView", {
  configurable: true,
  value: () => undefined,
});
