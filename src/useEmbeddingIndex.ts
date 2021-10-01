import { useMemo, useState, useEffect } from 'react';
import { NludbResponse, EmbeddingIndex, InsertRequest, InsertResult, NLUDB, CreateIndexRequest, SearchRequest, SearchResult } from '@nludb/client'
import useSafeGetSet from './util/useSafeGetSet';

export interface State {
  results: NludbResponse<SearchResult> | null,
  isReady: boolean;
  isSearching: boolean,
  error: Error | null
}

export interface StableActions {
  reset: () => void;
  search: (request: SearchRequest) => void;
  insert: (request: InsertRequest) => void;
}

export interface Actions extends StableActions {
}

export interface UseIndexParams extends CreateIndexRequest {
  nludb: NLUDB | null,
  verbose?: boolean
}

export const useEmbeddingIndex = (params: UseIndexParams): [State, Actions] => {
  params.verbose && console.log("useEmbeddingIndex:", params.nludb);
  const [embeddingIndex, setEmbeddingIndex] = useState<EmbeddingIndex | null>(null);
  const [getSearchRequest, setSearchRequest] = useSafeGetSet<SearchRequest | null>(null);
  const [getSearchResult, setSearchResult] = useSafeGetSet<NludbResponse<SearchResult> | null>(null);
  const [getError, setError] = useSafeGetSet<Error | null>(null);
  const [getIsSearching, setIsSearching] = useSafeGetSet<boolean>(false);

  // // Create the embedding index
  const {name, model, upsert} = (params as CreateIndexRequest);

  useEffect(() => {
    params.verbose && console.log("createIndexeffect")
    if (params.nludb) {
      params.verbose && console.log("useIndex:Create", params);
      params.nludb.createIndex({name, model, upsert}).then(
        (index: EmbeddingIndex) => {
          params.verbose && console.log("useIndex:Create:Done");
          setEmbeddingIndex(index)
        },
        (error: Error) => {
          params.verbose && console.log("useIndex:Create:Error", error);
          setError(error)
        }
      ).catch(
        (error: Error) => {
          params.verbose && console.log("useIndex:Create:Exception", error);
          setError(error)
        }
      )
    } else {
      params.verbose && console.log("useIndex:Create:setNull");
      setEmbeddingIndex(null);
    }
  }, [params.nludb, name, model, upsert]);

  // // Upon updates to one of [nludb, embeddingIndex, searchRquest], perform any search
  // // and/or update the results as necessary.
  useEffect(() => {
    params.verbose && console.log("useIndex:searchRequest:Effect")
    if (! params.nludb) {
      params.verbose && console.log("no NLUDB")
      setError(new Error("No NLUDB client available to perform search."))
      setIsSearching(false);
      setSearchResult(null)
    } else if (! getSearchRequest()) {
      params.verbose && console.log("Search request absent.")
      setIsSearching(false);
      setSearchResult(null)
    } else if (! embeddingIndex) {
      params.verbose && console.log("no index")
      setError(new Error("No index available to perform search."))
      setIsSearching(false);
      setSearchResult(null)
    } else {
      // Perform the search
      params.verbose && console.log("useIndex:search:Do")
      setIsSearching(true);
      embeddingIndex.search(getSearchRequest()!).then(
        (result: NludbResponse<SearchResult>) => {
          params.verbose && console.log("useIndex:search:Done", result);
          setIsSearching(false);
          setError(null);
          setSearchResult(result)
        },
        (error: Error) => {
          params.verbose && console.log("useIndex:search:Error", error);
          setIsSearching(false);
          setSearchResult(null);
          setError(error)
        }
      ).catch(
        (error: Error) => {
          params.verbose && console.log("useIndex:search:Exception", error);
          setIsSearching(false);
          setSearchResult(null);
          setError(error)
        }
      )
    }
  }, [embeddingIndex, getSearchRequest()]);

  // Actions for consumer to interact with the index.
  const stableActions = useMemo<StableActions>(() => {
    const reset = () => { setSearchRequest(null) };
    const search = (request: SearchRequest) => {
      // TODO:
      // Can we prevent this from being called *after* the result comes back?
      // The safeGetSet blocks it from causing an infinite loop, so there is
      // no adverse effect, but it still feels wrong.
      // To see in console, uncomment this and the log from the search result
      // return above.
      params.verbose && console.log("useIndex:searchRequest:set", request);
      setError(null);
      setIsSearching(true);
      setSearchRequest(request);
    }
    const insert = async (request: InsertRequest): Promise<InsertResult> => {
      // TODO:
      // Can we prevent this from being called *after* the result comes back?
      // The safeGetSet blocks it from causing an infinite loop, so there is
      // no adverse effect, but it still feels wrong.
      // To see in console, uncomment this and the log from the search result
      // return above.
      setError(null);
      params.verbose && console.log("useIndex:insert:try", request);
      if (! params.nludb) {
        params.verbose && console.log("useIndex:noNludb", request);
        return Promise.reject(new Error("NLUDB is not yet initialized"));
      } else if (!embeddingIndex) {
        params.verbose && console.log("useIndex:noIndex", request);
        return Promise.reject(new Error("Embedding Index not yet initialized"))
      } else {
        params.verbose && console.log("useIndex:do", request);
        const resp = await embeddingIndex.insert(request)
        if (resp.data) {
          return resp.data
        } else {
          return Promise.reject(new Error("No response from insert operation"))
        }
      }
    }
    return { reset, search, insert };
  }, [params]);

  const state = {
    results: getSearchResult(),
    isSearching: getIsSearching(),
    isReady: embeddingIndex != null,
    error: getError()
  }

  const utils = {
    ...stableActions,
  } as Actions;

  return [state, utils];
};
