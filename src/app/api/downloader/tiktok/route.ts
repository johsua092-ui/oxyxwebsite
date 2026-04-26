import { requireParam, proxyRequest } from "@/lib/api-utils";

export async function GET(request: Request) {
  const param = requireParam(request, "url");
  if ("error" in param) return param.error;

  return proxyRequest(
    `https://api.siputzx.my.id/api/d/tiktok?url=${encodeURIComponent(param.value)}`,
    "tiktok-downloader"
  );
}
