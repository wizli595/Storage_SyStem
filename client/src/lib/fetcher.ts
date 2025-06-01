type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export async function fetcher<T>(
  url: string,
  schema: { parse: (data: unknown) => T }
): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch ${url}: ${res.status} - ${errorText}`);
  }
  const json: ApiResponse<unknown> = await res.json();

  if (json.success) {
    return schema.parse(json.data);
  } else {
    throw new Error(`API error at ${url}: ${JSON.stringify(json)}`);
  }
}
