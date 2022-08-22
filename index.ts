import { ILike, Like } from "typeorm";

export interface IPaginationQuery {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
}

export interface IPaginationOptions {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  searchableColumns: string[];
  usedCaseSensitiveSearchSearch?: boolean;
  customQuery?: any;
  relations?: object
}

export interface IPagination {
  repository: any;
  opts: IPaginationOptions;
}

export const pagination = async ({ repository, opts }: IPagination) => {
  let {
    search = "",
    pageSize = 10,
    page = 1,
    sortBy,
    searchableColumns = [],
    relations = {},
    customQuery = {},
    usedCaseSensitiveSearchSearch = true,
  } = opts;

  page = Number(page);
  pageSize = Number(pageSize);

  const take = pageSize;
  const skip = (page - 1) * pageSize;

  let order = {};
  if (sortBy) {
    order = transformSortColumn(sortBy);
  }

  const [items, totalItems] = await repository.findAndCount({
    where: transformSearchColumn(search, searchableColumns, usedCaseSensitiveSearchSearch),
    order,
    take,
    skip,
    relations,
    ...customQuery,
  });

  const totalPages = Math.ceil((totalItems + pageSize - 1) / pageSize);
  const lastPage =
    totalItems % pageSize === 0
      ? totalItems / pageSize
      : Math.trunc(totalItems / pageSize) + 1;
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const previousPage = page - 1 > 0 ? page - 1 : null;

  return {
    items,
    meta: {
      itemCount: items.length,
      totalItems,
      totalPages,
      previousPage,
      currentPage: page,
      nextPage,
      lastPage,
    },
  };
};

const transformSearchColumn = (
  search: string,
  columns: string[],
  usedCaseSensitiveSearch: boolean
) => {
  const columnSearch: any = {};
  const LIKE = usedCaseSensitiveSearch ? ILike : Like;

  columns.forEach((column) => {
    columnSearch[column] = LIKE(`%${search}%`);
  });

  return columnSearch;
};

const transformSortColumn = (sort: string) => {
  const order: any = {};

  sort.split(",").forEach((value) => {
    const [column, direction] = value.split(":");
    order[column] = direction;
  });

  return order;
};
