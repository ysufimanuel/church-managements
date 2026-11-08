export type SearchHit = {
  id: string;
  /** Kunci grup, dipakai untuk judul grup & ikon (mis. 'members', 'events', 'page'). */
  group: string;
  title: string;
  subtitle?: string;
  href: string;
};
export type SearchResult = { hits: SearchHit[]; error?: string };
