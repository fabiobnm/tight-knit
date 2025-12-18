import { promises as fs } from "fs";
import path from "path";

export async function GET(_request: Request) {
  let html = await fs.readFile(
    path.resolve(process.cwd(), "public", "index.html"),
    "utf8"
  );

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
  });
}