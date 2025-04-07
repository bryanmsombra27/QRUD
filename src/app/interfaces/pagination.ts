export interface Pagination {
  page: number;
  limit: number;
  search: string;
}
export interface Meta {
  totalPages: number;
  actualPage: number;
  totalCount: number;
}
