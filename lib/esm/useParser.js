import { useMemo, useEffect } from 'react';
import { ParsingModel } from '@nludb/client';
import useSafeGetSet from './util/useSafeGetSet';
export const useParser = (params) => {
    const [getParseRequest, setParseRequest] = useSafeGetSet(null);
    const [getParseResult, setParseResult] = useSafeGetSet(null);
    const [getError, setError] = useSafeGetSet(null);
    const [getIsParsing, setIsParsing] = useSafeGetSet(false);
    // // Upon updates to one of [nludb, parseRequest], perform a new parse
    useEffect(() => {
        params.verbose && console.log("useParser:parseRequest:Effect");
        if (!params.nludb) {
            params.verbose && console.log("no NLUDB");
            setError(new Error("No NLUDB client available to perform parse."));
            setIsParsing(false);
            setParseResult(null);
        }
        else if (!getParseRequest()) {
            params.verbose && console.log("Parse request absent.");
            setIsParsing(false);
            setParseResult(null);
        }
        else {
            // Perform the search
            params.verbose && console.log("useParser:parse:Do");
            setIsParsing(true);
            const pr = Object.assign({ model: params.model || ParsingModel.EN_DEFAULT, includeEntities: params.includeEntities, includeTokens: params.includeTokens, metadata: params.metadata }, getParseRequest());
            params.nludb.parse(pr).then((result) => {
                params.verbose && console.log("useParser:parse:Done", result);
                setIsParsing(false);
                setError(null);
                setParseResult(result);
            }, (error) => {
                params.verbose && console.log("useParser:parse:Error", error);
                setIsParsing(false);
                setParseResult(null);
                setError(error);
            }).catch((error) => {
                params.verbose && console.log("useParser:parse:Exception", error);
                setIsParsing(false);
                setParseResult(null);
                setError(error);
            });
        }
    }, [getParseRequest()]);
    // Actions for consumer to interact with the index.
    const stableActions = useMemo(() => {
        const reset = () => { setIsParsing(false); setParseRequest(null); };
        const parse = (request) => {
            // TODO:
            // Can we prevent this from being called *after* the result comes back?
            // The safeGetSet blocks it from causing an infinite loop, so there is
            // no adverse effect, but it still feels wrong.
            // To see in console, uncomment this and the log from the search result
            // return above.
            params.verbose && console.log("useParser:parseRequest:set", request);
            setError(null);
            setIsParsing(true);
            setParseRequest(request);
        };
        return { reset, parse };
    }, [params]);
    const state = {
        results: getParseResult(),
        isParsing: getIsParsing(),
        error: getError()
    };
    const utils = Object.assign({}, stableActions);
    return [state, utils];
};
