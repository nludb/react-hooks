"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_use_1 = require("react-use");
const safeSet_1 = __importDefault(require("./safeSet"));
function useSafeGetSet(initialState) {
    const [getter, setter] = react_use_1.useGetSet(initialState);
    const safeSetter = (newState) => {
        safeSet_1.default(newState, getter, setter);
    };
    return [getter, safeSetter];
}
exports.default = useSafeGetSet;
