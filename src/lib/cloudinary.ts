import "server-only";
import { createHash } from "node:crypto";

const ALLOWED_FOLDERS = ["hero","teams","players","news","events","committee","gallery","sponsors","site"];
export const MAX_BYTES = 10 * 1024 * 1024;
export const ALLOWED_TYPES = ["image/jpeg","image/png","image/webp","image/avif"];

/** Server signs; browser uploads directly to Cloudinary (avoids Vercel's 4.5MB body limit). Secret stays server-side. */
export function signUpload(folder: string) {
  if (!ALLOWED_FOLDERS.includes(folder)) throw new Error("Invalid folder");
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `folder=umat-sports/${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(toSign + process.env.CLOUDINARY_API_SECRET!).digest("hex");
  return { timestamp, signature, folder: `umat-sports/${folder}`,
    apiKey: process.env.CLOUDINARY_API_KEY!, cloudName: process.env.CLOUDINARY_CLOUD_NAME! };
}

export const cldUrl = (publicId: string, w = 800) =>
  `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,c_limit,w_${w}/${publicId}`;
