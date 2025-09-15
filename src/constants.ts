/**
 * State keys for caching, used to save and retrieve state in GitHub Actions.
 */
export enum State {
  CachePrimaryKey = "CACHE_KEY", // The primary key for the cache
  CacheMatchedKey = "CACHE_RESULT", // The result key for the cache
}
