"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNLUDB = void 0;
const useSafeGetSet_1 = __importDefault(require("./util/useSafeGetSet"));
const client_1 = require("@nludb/client");
const react_1 = require("react");
exports.useNLUDB = (params) => {
    const [getError, setError] = useSafeGetSet_1.default(null);
    const nludb = react_1.useMemo(() => {
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
                return new client_1.NLUDB({ apiKey: params.apiKey, apiDomain: params.apiDomain });
            }
        }
    }, [params.client, params === null || params === void 0 ? void 0 : params.apiKey, params === null || params === void 0 ? void 0 : params.apiDomain, , params === null || params === void 0 ? void 0 : params.apiVersion]);
    return [nludb, getError()];
};
