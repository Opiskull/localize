export async function handleRequest(request: Request): Promise<Response> {
  // GET /:projectId/:fileName?lang=de&format=js&edit=1

  const url = new URL(request.url);

  const lang = url.searchParams.get("lang") ?? 'en';
  const format = url.searchParams.get("format") ?? 'json';
  const download = url.searchParams.get("download") === 'true' || url.searchParams.get("download") === '' || url.searchParams.get("download") === '1';
  const projectId = url.pathname.match("[^/]+");
  const fileName = url.pathname.match("[^\/]+$");
  if (request.method === 'GET') {    
    const json: string = (await LOCALIZE_STORE.get(`/${projectId}/${fileName}/${lang}`)) || "{}";

    return formatResponse(json, format || '', download);
  }

  return new Response(`request method: ${request.method}`)
}

function formatResponse(json: string, format: string, download: boolean) {
  if(format === 'json') {
    return new Response(json, { headers: {"content-type":  download ? "application/octet-stream" : "application/json"}});
  }

  if(format === 'js') {
    return new Response(`const translation = JSON.parse(${json})`, {headers:{"content-type": download ? "application/octet-stream" :"application/javascript"}});
  }

  return new Response('{}', { headers:{"content-type": "application/json"}})

}
