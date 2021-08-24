import { IHookStateInitAction, IHookStateSetAction } from './resolveHookState';
import { Dispatch } from 'react';
export default function useSafeGetSet<S>(initialState: IHookStateInitAction<S>): [get: () => S, set: Dispatch<IHookStateSetAction<S>>];
