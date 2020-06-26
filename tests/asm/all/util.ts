import { Coder } from "@stablelib/base64";

function isFunction(value: any) {
  return typeof value === "function";
}

export function assert(condition: any, message: any) {
  if (!condition) {
    throw new Error(isFunction(message) ? message() : message);
  }
}

export const base64Encode = (bytes: Uint8Array): string => {
  const coder = new Coder();
  return coder.encode(bytes);
};

export const base64Decode = (string: string): Uint8Array => {
  const coder = new Coder();
  return coder.decode(string);
};
