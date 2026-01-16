import type { SearchResult, SearchBackend } from "../types";

export abstract class BaseSearchBackend implements SearchBackend {
  abstract name: string;
  abstract search(query: string, maxResults: number): Promise<SearchResult[]>;
}
