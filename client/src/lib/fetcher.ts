import { ZodSchema } from "zod";
import { AxiosRequestConfig } from "axios";
import { api } from "./axios";

export async function fetcher<T>(
  url: string,
  schema: ZodSchema<T>,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.get(url, config);

  // Assuming your API always returns { success: true, data: realData }
  const realData = response.data.data;
  console.log(response.data);
  console.log("Fetched data:", realData);

  return schema.parse(realData); // parse the extracted 'data'
}

export async function poster<T, D>(
  url: string,
  data: D,
  schema: ZodSchema<T>,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await api.post(url, data, config);
  const realData = response.data.data;
  return schema.parse(realData);
}
