import { useMemo, useEffect } from 'react';
import { NLUDB, ParseRequest, ParseResponse, ParsingModel } from '@nludb/client'
import useSafeGetSet from './util/useSafeGetSet';

export interface State {
  results: ParseResponse | null,
  isParsing: boolean,
  error: Error | null
}

export interface StableActions {
  reset: () => void;
  parse: (request: ParseRequest) => void;
}

export interface Actions extends StableActions {
}

export interface UseParserParams {
  nludb: NLUDB | null,
  verbose?: boolean,
  model?: string,
  includeEntities?: boolean,
  includeTokens?: boolean,
  metadata?: unknown
}

export const useParser = (params: UseParserParams): [State, Actions] => {
  const [getParseRequest, setParseRequest] = useSafeGetSet<ParseRequest | null>(null);
  const [getParseResult, setParseResult] = useSafeGetSet<ParseResponse | null>(null);
  const [getError, setError] = useSafeGetSet<Error | null>(null);
  const [getIsParsing, setIsParsing] = useSafeGetSet<boolean>(false);

  // // Upon updates to one of [nludb, parseRequest], perform a new parse
  useEffect(() => {
    params.verbose && console.log("useParser:parseRequest:Effect")
    if (! params.nludb) {
      params.verbose && console.log("no NLUDB")
      setError(new Error("No NLUDB client available to perform parse."))
      setParseResult(null)
    } else if (! getParseRequest()) {
      params.verbose && console.log("Parse request absent.")
      setParseResult(null)
    } else {
      // Perform the search
      params.verbose && console.log("useParser:parse:Do")
      setIsParsing(true);
      const pr = {
        model: params.model || ParsingModel.EN_DEFAULT,
        includeEntities: params.includeEntities,
        includeTokens: params.includeTokens,
        metadata: params.metadata,
        ...getParseRequest(),
      }
      params.nludb.parse(pr as ParseRequest).then(
        (result: ParseResponse) => {
          params.verbose && console.log("useParser:parse:Done", result);
          setIsParsing(false);
          setError(null);
          setParseResult(result)
        },
        (error: Error) => {
          params.verbose && console.log("useParser:parse:Error", error);
          setIsParsing(false);
          setParseResult(null);
          setError(error)
        }
      ).catch(
        (error: Error) => {
          params.verbose && console.log("useParser:parse:Exception", error);
          setParseResult(null);
          setError(error)
        }
      )
    }
  }, [getParseRequest()]);

  // Actions for consumer to interact with the index.
  const stableActions = useMemo<StableActions>(() => {
    const reset = () => { setParseRequest(null) };
    const parse = (request: ParseRequest) => {
      // TODO:
      // Can we prevent this from being called *after* the result comes back?
      // The safeGetSet blocks it from causing an infinite loop, so there is
      // no adverse effect, but it still feels wrong.
      // To see in console, uncomment this and the log from the search result
      // return above.
      params.verbose && console.log("useParser:parseRequest:set", request);
      setError(null);
      setParseRequest(request);
    }
    return { reset, parse };
  }, [params]);

  const state = {
    results: getParseResult(),
    isParsing: getIsParsing(),
    error: getError()
  }

  const utils = {
    ...stableActions,
  } as Actions;

  return [state, utils];
};
