import { useGetSet } from 'react-use';
import safeSet from './safeSet';
import {IHookStateInitAction, IHookStateSetAction} from './resolveHookState'
import { Dispatch } from 'react';

export default function useSafeGetSet<S>(
  initialState: IHookStateInitAction<S>
): [get: () => S, set: Dispatch<IHookStateSetAction<S>>] {
  const [getter, setter] = useGetSet(initialState)
  const safeSetter = (newState: IHookStateSetAction<S>) => {
    safeSet(newState, getter, setter)
  }
  return [getter, safeSetter]
}
