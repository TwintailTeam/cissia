const imageElementCache = new Map<string, HTMLImageElement | HTMLVideoElement>();
const pendingPreloads = new Map<string, Promise<void>>();
const loadedUrls = new Set<string>();
const failedUrls = new Set<string>();

export const isLinux = typeof navigator !== "undefined" && navigator.platform.includes("Linux");

export function isVideoUrl(url: string): boolean {
    // if (isLinux) return false;
    return url.endsWith(".webm") || url.endsWith(".mp4");
}

export function isImagePreloaded(url: string): boolean {
    return loadedUrls.has(url) && !failedUrls.has(url);
}

export function isImageFailed(url: string): boolean {
    return failedUrls.has(url);
}

export function isPreloading(url: string): boolean {
    return pendingPreloads.has(url);
}

export function getFailedImageCount(): number {
    return failedUrls.size;
}

export function getPreloadedImage(url: string): HTMLImageElement | HTMLVideoElement | undefined {
    return imageElementCache.get(url);
}

export function cacheImage(url: string, element: HTMLImageElement | HTMLVideoElement, failed: boolean = false): void {
    if (!url) return;
    pendingPreloads.delete(url);

    if (failed) {
        loadedUrls.delete(url);
        failedUrls.add(url);
        imageElementCache.delete(url);
    } else {
        loadedUrls.add(url);
        failedUrls.delete(url);
        imageElementCache.set(url, element);
    }
}

export function clearFailedImages(): void {
    for (const url of failedUrls) {
        loadedUrls.delete(url);
        imageElementCache.delete(url);
    }
    failedUrls.clear();
}

export function preloadImage(src: string): Promise<void> {
    if (loadedUrls.has(src) && !failedUrls.has(src)) {
        return Promise.resolve();
    }

    const pending = pendingPreloads.get(src);
    if (pending) {
        return pending;
    }

    const promise = new Promise<void>((resolve) => {
        if (isVideoUrl(src)) {
            const video = document.createElement("video");
            video.preload = "auto";
            video.muted = true;
            video.playsInline = true;
            video.autoplay = false;
            video.loop = true;

            const handleReady = () => {
                if (!loadedUrls.has(src)) {
                    loadedUrls.add(src);
                    imageElementCache.set(src, video);
                    pendingPreloads.delete(src);
                    resolve();
                }
            };

            video.oncanplaythrough = handleReady;
            video.onloadeddata = handleReady;

            video.onerror = () => {
                loadedUrls.delete(src);
                failedUrls.add(src);
                imageElementCache.delete(src);
                pendingPreloads.delete(src);
                resolve();
            };

            video.src = src;
            video.load();
        } else {
            const img = new window.Image();

            try {
                img.fetchPriority = "high";
            } catch { /* ignore */ }
            img.decoding = "async";
            img.loading = "eager";

            img.onload = () => {
                const completeLoad = () => {
                    loadedUrls.add(src);
                    failedUrls.delete(src);
                    imageElementCache.set(src, img);
                    pendingPreloads.delete(src);
                    resolve();
                };

                if (typeof img.decode === "function") {
                    img.decode().catch(() => { }).finally(completeLoad);
                } else {
                    completeLoad();
                }
            };

            img.onerror = () => {
                loadedUrls.delete(src);
                failedUrls.add(src);
                imageElementCache.delete(src);
                pendingPreloads.delete(src);
                resolve();
            };

            img.src = src;
        }
    });

    pendingPreloads.set(src, promise);
    return promise;
}

export function preloadImages(urls: string[], onProgress?: (loaded: number, total: number) => void, cache?: Set<string>): Promise<void> {
    return new Promise((resolve) => {
        const loadedCache = cache || new Set<string>();

        const toLoad = urls.filter((src) => {
            if (!src) return false;
            if (isImagePreloaded(src)) return false;
            return !(loadedCache.has(src) && !isImageFailed(src));
        });

        const total = toLoad.length;
        if (total === 0) return resolve();

        let completed = 0;

        toLoad.forEach((src) => {
            preloadImage(src).then(() => {
                if (isImagePreloaded(src)) loadedCache.add(src);
                completed++;
                if (onProgress) onProgress(completed, total);
                if (completed === total) resolve();
            });
        });
    });
}
