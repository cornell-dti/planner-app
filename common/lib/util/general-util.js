/**
 * Generate a random id to make React happy.
 *
 * @return {number} a random id.
 */
export const randomId = () => String(new Date().getTime());
/**
 * The identity function.
 */
export function identity(t) { return t; }
/**
 * An empty function used to ignore promise.
 */
export const ignore = () => { };
/**
 * Throw an error. Useful when want to use this as an expression.
 *
 * @param {?string} message an optional message.
 */
export const error = (message) => { throw new Error(message); };
/**
 * Shallowly check equality of two objects.
 *
 * @param a object a.
 * @param b object b.
 */
export const shallowEqual = (a, b) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    const l = aKeys.length;
    if (l !== bKeys.length) {
        return false;
    }
    for (let i = 0; i < l; i += 1) {
        const aKey = aKeys[i];
        if (a[aKey] !== b[aKey]) {
            return false;
        }
        const bKey = bKeys[i];
        if (a[bKey] !== b[bKey]) {
            return false;
        }
    }
    return true;
};
/**
 * Shallowly check equality of two arrays.
 *
 * @param a array a.
 * @param b array b.
 */
export const shallowArrayEqual = (a, b) => {
    const l = a.length;
    if (l !== b.length) {
        return false;
    }
    for (let i = 0; i < l; i += 1) {
        if (!shallowEqual(a[i], b[i])) {
            return false;
        }
    }
    return true;
};
