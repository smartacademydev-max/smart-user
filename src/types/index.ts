export interface QueryParams {
  pageIndex: number;
  pageSize: number;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface CategoryFilterParams {
  mega_category: number[];
  category?: number[];
  sub_category?: number[];
  positions?: number[];
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}
