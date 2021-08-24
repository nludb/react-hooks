import { useGetSet } from 'react-use';
import safeSet from './safeSet';
export default function useSafeGetSet(initialState) {
    const [getter, setter] = useGetSet(initialState);
    const safeSetter = (newState) => {
        safeSet(newState, getter, setter);
    };
    return [getter, safeSetter];
}
