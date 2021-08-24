import { IHookStateSetAction } from './resolveHookState';
declare const safeSet: <T>(newState: IHookStateSetAction<T | null>, getter: () => T | null, setter: (t: T | null) => void) => void;
export default safeSet;
