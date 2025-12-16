/** Restores the RPC cache using the provided keys. */
export declare function restoreRPCCache(): Promise<void>;
/**
 * Saves the RPC cache using the primary key saved in the state.
 * If the cache was already saved with the primary key, it will not save it again.
 */
export declare function saveCache(): Promise<void>;
