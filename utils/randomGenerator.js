import { randomBytes } from "crypto";

export const generateRandomHex = () => {
  const buffer = randomBytes(4);
  return "#" + buffer.toString("hex");
}

