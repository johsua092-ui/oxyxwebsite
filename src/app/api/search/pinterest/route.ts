import { requireParam, proxyRequest } from "@/lib/api-utils";

export async function GET(request: Request) {
  const param = requireParam(request, "query");
  if ("error" in param) return param.error;

  return proxyRequest(
    `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(param.value)}`,
    "pinterest-search"
  );
}
