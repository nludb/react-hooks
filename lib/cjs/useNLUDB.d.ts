import { NLUDB, NLUDBError } from '@nludb/client';
export interface NLUDBReactConnectionParams {
    client?: NLUDB;
    apiDomain?: string;
    apiVersion?: string;
    apiKey?: string;
    verbose?: boolean;
}
export declare const useNLUDB: (params: NLUDBReactConnectionParams) => [NLUDB | null, NLUDBError | null];
