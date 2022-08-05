import { Magic } from "magic-sdk";

const createMagic = () => {
  if (typeof window !== "undefined") {
    return new Magic(process.env.NEXT_PUBLIC_MAGIC_API_KEY);
  }

  return true;
};

export const magic = createMagic();
