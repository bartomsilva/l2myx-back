import crypto from 'crypto';

export function encryptPassword(password: string): string {
  const sha1Hash = crypto.createHash("sha1").update(password).digest();
  return sha1Hash.toString("base64");
}
