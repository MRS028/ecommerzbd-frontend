/**
 * Safely extracts an array from any common API response shape.
 * Handles: [...], { data: [...] }, { data: { items: [...] } },
 * { data: { categories: [...] } }, { items: [...] }, { results: [...] }, etc.
 */
export function extractList<T = any>(response: any): T[] {
  if (!response) return [];

  // Case 1: axios response object
  const body = response.data !== undefined ? response.data : response;

  // Case 2: response is directly an array
  if (Array.isArray(body)) return body;

  // Case 3: { data: [...] }
  if (Array.isArray(body?.data)) return body.data;

  // Case 4: { data: { <anyKey>: [...] } }
  if (body?.data && typeof body.data === 'object') {
    const commonKeys = ['items', 'results', 'records', 'list', 'rows', 'docs', 'products', 'orders', 'users', 'categories'];
    for (const key of commonKeys) {
      if (Array.isArray(body.data[key])) return body.data[key];
    }
    const firstArray = Object.values(body.data).find(Array.isArray);
    if (firstArray) return firstArray as T[];
  }

  // Case 5: { items: [...] } / { results: [...] } etc (no data wrapper)
  if (typeof body === 'object') {
    const commonKeys = ['items', 'results', 'records', 'list', 'rows', 'docs', 'products', 'orders', 'users', 'categories'];
    for (const key of commonKeys) {
      if (Array.isArray(body[key])) return body[key];
    }
    const firstArray = Object.values(body).find(Array.isArray);
    if (firstArray) return firstArray as T[];
  }

  return [];
}

/**
 * Extracts pagination meta from common shapes.
 */
export function extractMeta(response: any) {
  const body = response?.data !== undefined ? response.data : response;
  return (
    body?.meta ??
    body?.data?.meta ??
    body?.pagination ??
    body?.data?.pagination ??
    null
  );
}

/**
 * Safely extracts a single object from common API response shapes.
 * Handles: { data: {...} }, { product: {...} }, direct object, etc.
 */
export function extractOne<T = any>(response: any): T | null {
  if (!response) return null;
  const body = response.data !== undefined ? response.data : response;

  if (body && typeof body === 'object' && !Array.isArray(body)) {
    if (body.data && typeof body.data === 'object' && !Array.isArray(body.data)) {
      return body.data as T;
    }
    if (body.product && typeof body.product === 'object') return body.product as T;
    if (body.order && typeof body.order === 'object') return body.order as T;
    if (body.user && typeof body.user === 'object') return body.user as T;
    if (body.category && typeof body.category === 'object') return body.category as T;
    if (body.item && typeof body.item === 'object') return body.item as T;
    if (body.result && typeof body.result === 'object') return body.result as T;
    return body as T;
  }
  return null;
}