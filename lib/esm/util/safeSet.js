import equal from 'deep-equal';
import { resolveHookState } from './resolveHookState';
const safeSet = (newState, getter, setter) => {
    /*
     * Since we're passing the setter functions back up to the parent owners of our
     * hooks, it's easy for an endless loop to occur. This blocks setting something
     * to the same value it previously had, causing an infinite loop.
     */
    const prevState = getter();
    let rState = resolveHookState(newState, prevState);
    if (!equal(prevState, rState)) {
        setter(rState);
    }
};
export default safeSet;
