"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEmbeddingIndex = void 0;
const react_1 = require("react");
const useSafeGetSet_1 = __importDefault(require("./util/useSafeGetSet"));
exports.useEmbeddingIndex = (params) => {
    params.verbose && console.log("useEmbeddingIndex:", params.nludb);
    const [embeddingIndex, setEmbeddingIndex] = react_1.useState(null);
    const [getSearchRequest, setSearchRequest] = useSafeGetSet_1.default(null);
    const [getSearchResult, setSearchResult] = useSafeGetSet_1.default(null);
    const [getError, setError] = useSafeGetSet_1.default(null);
    const [getIsSearching, setIsSearching] = useSafeGetSet_1.default(false);
    // // Create the embedding index
    const { name, model, upsert } = params;
    react_1.useEffect(() => {
        params.verbose && console.log("createIndexeffect");
        if (params.nludb) {
            params.verbose && console.log("useIndex:Create", params);
            params.nludb.createIndex({ name, model, upsert }).then((index) => {
                params.verbose && console.log("useIndex:Create:Done");
                setEmbeddingIndex(index);
            }, (error) => {
                params.verbose && console.log("useIndex:Create:Error", error);
                setError(error);
            }).catch((error) => {
                params.verbose && console.log("useIndex:Create:Exception", error);
                setError(error);
            });
        }
        else {
            params.verbose && console.log("useIndex:Create:setNull");
            setEmbeddingIndex(null);
        }
    }, [params.nludb, name, model, upsert]);
    // // Upon updates to one of [nludb, embeddingIndex, searchRquest], perform any search
    // // and/or update the results as necessary.
    react_1.useEffect(() => {
        params.verbose && console.log("useIndex:searchRequest:Effect");
        if (!params.nludb) {
            params.verbose && console.log("no NLUDB");
            setError(new Error("No NLUDB client available to perform search."));
            setIsSearching(false);
            setSearchResult(null);
        }
        else if (!getSearchRequest()) {
            params.verbose && console.log("Search request absent.");
            setIsSearching(false);
            setSearchResult(null);
        }
        else if (!embeddingIndex) {
            params.verbose && console.log("no index");
            setError(new Error("No index available to perform search."));
            setIsSearching(false);
            setSearchResult(null);
        }
        else {
            // Perform the search
            params.verbose && console.log("useIndex:search:Do");
            setIsSearching(true);
            embeddingIndex.search(getSearchRequest()).then((result) => {
                params.verbose && console.log("useIndex:search:Done", result);
                setIsSearching(false);
                setError(null);
                if (result.data) {
                    setSearchResult(result.data);
                }
                else {
                    setSearchResult(null);
                }
            }, (error) => {
                params.verbose && console.log("useIndex:search:Error", error);
                setIsSearching(false);
                setSearchResult(null);
                setError(error);
            }).catch((error) => {
                params.verbose && console.log("useIndex:search:Exception", error);
                setIsSearching(false);
                setSearchResult(null);
                setError(error);
            });
        }
    }, [embeddingIndex, getSearchRequest()]);
    // Actions for consumer to interact with the index.
    const stableActions = react_1.useMemo(() => {
        const reset = () => { setSearchRequest(null); };
        const search = (request) => {
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
        };
        const insert = async (request) => {
            // TODO:
            // Can we prevent this from being called *after* the result comes back?
            // The safeGetSet blocks it from causing an infinite loop, so there is
            // no adverse effect, but it still feels wrong.
            // To see in console, uncomment this and the log from the search result
            // return above.
            setError(null);
            params.verbose && console.log("useIndex:insert:try", request);
            if (!params.nludb) {
                params.verbose && console.log("useIndex:noNludb", request);
                return Promise.reject(new Error("NLUDB is not yet initialized"));
            }
            else if (!embeddingIndex) {
                params.verbose && console.log("useIndex:noIndex", request);
                return Promise.reject(new Error("Embedding Index not yet initialized"));
            }
            else {
                params.verbose && console.log("useIndex:do", request);
                const resp = await embeddingIndex.insert(request);
                if (resp.data) {
                    return resp.data;
                }
                else {
                    return Promise.reject(new Error("No response from insert operation"));
                }
            }
        };
        return { reset, search, insert };
    }, [params]);
    const state = {
        results: getSearchResult(),
        isSearching: getIsSearching(),
        isReady: embeddingIndex != null,
        error: getError()
    };
    const utils = Object.assign({}, stableActions);
    return [state, utils];
};
