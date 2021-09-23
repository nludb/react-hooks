import useSafeGetSet from './util/useSafeGetSet';
import { NLUDB } from '@nludb/client';
import { useMemo } from 'react';
export const useNLUDB = (params) => {
    const [getError, setError] = useSafeGetSet(null);
    const nludb = useMemo(() => {
        if (params === null) {
            return null;
        }
        else if (params.client) {
            return params.client;
        }
        else {
            if (!params.apiKey) {
                params.verbose && console.log("useNLUDB:createClient:no API Key");
                setError(new Error("No API Key provided"));
                return null;
            }
            else {
                return new NLUDB(params.apiKey, params.apiEndpoint);
            }
        }
    }, [params.client, params === null || params === void 0 ? void 0 : params.apiKey, params === null || params === void 0 ? void 0 : params.apiEndpoint, , params === null || params === void 0 ? void 0 : params.apiVersion]);
    return [nludb, getError()];
};
