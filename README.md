Typeorm pagination plugin for nodejs

## Installation

```
npm install typeorm-paginate
```

## Usage

```
import { pagination, IPaginationQuery } from 'typeorm-paginate';
import { vendorRepository } from './vendor.repository';

async findAll({ search, page, pageSize, sort }: IPaginationQuery) {
    const { items, meta } = await pagination({
        repository: vendorRepository,
        opts: {
            search,
            page, // default: 1
            pageSize, // default: 10
            sortBy, // example: id:asc,createdAt:desc
            searchableColumns: ['name'],
            usedCaseSensitiveSearch: true, // default: true
            customQuery: {
                // where: {}
                // relations: {}
                // ...
            }
        },
    });
    
    return {
        items,
        meta
    };
}
```

## Result

```
{
    "items": [
        {
            "deletedAt": null,
            "isDeleted": false,
            "id": 19,
            "name": "Demo1",
            "createdAt": "2022-08-20T07:27:46.273Z",
            "updatedAt": "2022-08-20T07:27:46.273Z"
        },
        {
            "deletedAt": null,
            "isDeleted": false,
            "id": 18,
            "name": "Demo2",
            "createdAt": "2022-08-20T07:27:27.314Z",
            "updatedAt": "2022-08-20T07:27:27.314Z"
        },
        {
            "deletedAt": null,
            "isDeleted": false,
            "id": 17,
            "name": "Demo3",
            "createdAt": "2022-08-20T07:27:24.542Z",
            "updatedAt": "2022-08-20T07:27:24.542Z"
        },
        ...
    ],
    "meta": {
        "itemCount": 10,
        "totalItems": 11,
        "totalPages": 2,
        "previousPage": null,
        "currentPage": 1,
        "nextPage": 2,
        "lastPage": 2
    }
}
```
