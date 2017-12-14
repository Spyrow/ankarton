export function sleep(ms = 0) {
  return new Promise((r) => setTimeout(r, ms));
}

export function randomString(len: number, bits: number = 36) {
  let outStr = "";
  let newStr;
  while (outStr.length < len) {
    newStr = Math.random().toString(bits).slice(2);
    outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
  }
  return outStr;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function readableString(length: number) {
  const VOWELS = "aeiouy".split("");
  const CONSONANTS = "bcdfghjklmnprstvwxz".split("");
  const VOWELS_LENGTH = VOWELS.length;
  const CONSONANTS_LENGTH = CONSONANTS.length;

  let randomstring = "";
  const salt = Math.floor(Math.random() * 2);
  for (let i = length + salt, end = 0 + salt; i > end; i -= 1) {
    if (i % 2 === 0) {
      randomstring += CONSONANTS[Math.floor(Math.random() * CONSONANTS_LENGTH)];
    } else {
      randomstring += VOWELS[Math.floor(Math.random() * VOWELS_LENGTH)];
    }
  }

  return randomstring;
}
