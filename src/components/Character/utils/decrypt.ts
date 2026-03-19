async function generateAESKey(password: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  return crypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

const decryptMemo = new Map<string, Promise<ArrayBuffer>>();

async function getEncryptedBuffer(url: string): Promise<ArrayBuffer> {
  if ("caches" in window) {
    const cache = await caches.open("portfolio-model-cache-v1");
    let cachedResponse = await cache.match(url);
    if (!cachedResponse) {
      const networkResponse = await fetch(url, { cache: "force-cache" });
      if (!networkResponse.ok) {
        throw new Error(`Failed to fetch encrypted model: ${networkResponse.status}`);
      }
      await cache.put(url, networkResponse.clone());
      cachedResponse = networkResponse;
    }
    return cachedResponse.arrayBuffer();
  }

  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Failed to fetch encrypted model: ${response.status}`);
  }
  return response.arrayBuffer();
}

export const decryptFile = async (
  url: string,
  password: string
): Promise<ArrayBuffer> => {
  const cacheKey = `${url}::${password}`;
  if (decryptMemo.has(cacheKey)) {
    return decryptMemo.get(cacheKey)!;
  }

  const pending = (async () => {
    const encryptedData = await getEncryptedBuffer(url);
    const iv = new Uint8Array(encryptedData.slice(0, 16));
    const data = encryptedData.slice(16);
    const key = await generateAESKey(password);
    return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
  })();

  decryptMemo.set(cacheKey, pending);
  return pending;
};
