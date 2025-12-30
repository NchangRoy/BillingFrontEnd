/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BonCommandeResponse } from './BonCommandeResponse';
import type { PageableObject } from './PageableObject';
import type { SortObject } from './SortObject';
export type PageBonCommandeResponse = {
    totalElements?: number;
    totalPages?: number;
    pageable?: PageableObject;
    size?: number;
    content?: Array<BonCommandeResponse>;
    number?: number;
    sort?: SortObject;
    numberOfElements?: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
};

