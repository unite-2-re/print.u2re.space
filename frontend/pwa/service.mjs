// Config
const NETWORK_TIMEOUT_MS = 6000; // hosting, amvera
//const NETWORK_TIMEOUT_MS = 3000; //localhost, router
const RUNTIME = "webapp";

const efficientTimeout = {
    "5g": 2000,
    "4g": 3000,
    "3g": 4000,
    "2g": 4000,
    "2g-slow": 4000
};

//
const isSameOrigin = (urlString) => {
    const urlOrigin = new URL(urlString)?.origin?.trim?.();
    return urlOrigin?.startsWith?.(self.location.origin) || 
           urlOrigin?.startsWith?.("#") || 
           urlOrigin?.startsWith?.("?") || 
           !urlOrigin?.startsWith?.("http");
};

//
const _WARN_ = (...args) => {
    const real = args.filter((v) => v != null);
    if (real && real.length > 0)
        { console.warn(...real); };
    return null;
};

//
const tryFetch = (req, event, cachedResponse = null) => {
    const sendResponse = async (response) => {
        if ((await response)?.status === 304) { return cachedResponse; };

        //
        const resp = Promise?.try?.(async ()=>{
            const clone = await (await response)?.clone?.();
            return (clone || response);
        });
        Promise?.try?.(async ()=>{
            const rc = (await resp) || (await response);
            if (rc && (rc?.ok || rc?.status == 200)) {
                const cache = await caches.open(RUNTIME)?.catch?.(console.warn.bind(console));
                await cache?.put?.(req, rc)?.catch?.(console.warn.bind(console));
                return rc;
            }
        })?.catch?.(console.warn.bind(console));

        //
        return response;
    };

    //
    {   //
        const eTag = cachedResponse?.headers?.get?.('ETag');
        const etagH = eTag ? { 'If-None-Match': eTag } : {};
        const url = (req?.url || req);

        // @ts-ignore
        const ctime = !navigator.onLine || Math.min((navigator?.connection?.rtt*4) || efficientTimeout[navigator?.connection?.effectiveType], efficientTimeout[navigator?.connection?.effectiveType]) || 1000;
        const fc = new Promise((resolve, reject) =>setTimeout(() => reject(null), ctime)).catch(_WARN_);
        const fp = fetch(req, {
            priority: (url?.includes?.(".mjs") || url?.includes?.(".js") || url?.includes?.(".css")) ? "high" : "low",
            headers: {...etagH},
            cache: "no-store",
            signal: AbortSignal.timeout(ctime + 2000),
            mode: url?.startsWith("http:") ? "no-cors" : (isSameOrigin(url) ? "same-origin" : "cors"),
        }).then(sendResponse).catch(_WARN_);

        //
        return Promise.race([fp, fc]).catch((_) => null);
    }
};

//
const fit = (req, event) => {
    const tryLoad = async (cachedResponse = null)=>{
        const $C = await cachedResponse;
        for (let i = 0; i < 3; i++) {
            try {
                const resp = await tryFetch(req, event, $C);
                if (await resp) { return resp; }
            } catch (e) {
                console.warn(e);
            }
            console.warn("Attempt: " + i + ", failed, trying again...");
        }
        return null;
    };

    //
    const cached = caches.open(RUNTIME).then((c) => c?.match?.(req, {
        ignoreSearch: true,
        ignoreMethod: true,
        ignoreVary: true,
    })).catch(()=>null);

    //
    event?.waitUntil?.(cached);

    //
    const useCached = (!navigator.onLine || navigator?.connection?.effectiveType == "slow-2g");
    const anyone = (useCached ? cached : Promise.try(tryLoad, cached))?.then?.((r)=>(r||cached))?.catch(()=>cached);
    anyone?.then?.(()=>self.skipWaiting());
    return anyone;
};

//
const putCacheAll = (list) => {
    return Promise.allSettled(
        list.map(async (it) => {
            const cache = await caches.open(RUNTIME);
            return cache.add(it);
        })
    ).catch(_WARN_);
};

//
const preloadNeeded = (list) => {
    const cache = putCacheAll(list);
    cache.then(()=>self.skipWaiting());
    return cache;
};

//
const PRE_CACHE_FORCE = [].map((u) => new URL(u, self.location.origin).href);

//
self?.addEventListener?.("install", (event) => {
    event.waitUntil(preloadNeeded([...PRE_CACHE_FORCE]));
    self.skipWaiting();
});

//
self?.addEventListener?.('activate', (event) => {
    const claims = self.clients.claim();
    claims.then(()=>self.skipWaiting())
    event.waitUntil(claims);
});

//
self?.addEventListener?.('fetch', (event) => {
    event.respondWith(fit(event.request, event));
});
