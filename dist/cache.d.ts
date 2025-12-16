/** Restores the cache using the provided keys. */
export declare function restoreCache(): Promise<void>;
/**
 * Saves the cache using the primary key saved in the state.
 * If the cache was already saved with the primary key, it will not save it again.
 */
export declare function saveCache(): Promise<void>;
