export declare function sleep(ms?: number): Promise<{}>;
export declare function randomString(len: number, bits?: number): string;
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export declare function getRandomArbitrary(min: number, max: number): number;
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export declare function getRandomInt(min: number, max: number): number;
export declare function readableString(length: number): string;
