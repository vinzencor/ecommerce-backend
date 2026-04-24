import crypto from "crypto";

//   "USR-A1B2C3"

export function generateCustomId(prefix) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const bytes = crypto.randomBytes(6);
    const code = Array.from(bytes)
        .map((b) => chars[b % chars.length])
        .join("");
    return `${prefix}-${code}`;
}
