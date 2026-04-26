import { requireParam, proxyRequest } from "@/lib/api-utils";

export async function GET(request: Request) {
  const param = requireParam(request, "url");
  if ("error" in param) return param.error;

  return proxyRequest(
    request,
    `https://api.siputzx.my.id/api/d/igdl?url=${encodeURIComponent(param.value)}`,
    "instagram-downloader"
  );
}
