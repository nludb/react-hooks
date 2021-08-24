"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deep_equal_1 = __importDefault(require("deep-equal"));
const resolveHookState_1 = require("./resolveHookState");
const safeSet = (newState, getter, setter) => {
    /*
     * Since we're passing the setter functions back up to the parent owners of our
     * hooks, it's easy for an endless loop to occur. This blocks setting something
     * to the same value it previously had, causing an infinite loop.
     */
    const prevState = getter();
    let rState = resolveHookState_1.resolveHookState(newState, prevState);
    if (!deep_equal_1.default(prevState, rState)) {
        setter(rState);
    }
};
exports.default = safeSet;
