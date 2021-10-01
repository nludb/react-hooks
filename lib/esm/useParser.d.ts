import { NLUDB, NludbResponse, ParseRequest, ParseResponse } from '@nludb/client';
export interface State {
    results: NludbResponse<ParseResponse> | null;
    isParsing: boolean;
    error: Error | null;
}
export interface StableActions {
    reset: () => void;
    parse: (request: ParseRequest) => void;
}
export interface Actions extends StableActions {
}
export interface UseParserParams {
    nludb: NLUDB | null;
    verbose?: boolean;
    model?: string;
    includeEntities?: boolean;
    includeTokens?: boolean;
    metadata?: unknown;
}
export declare const useParser: (params: UseParserParams) => [State, Actions];
