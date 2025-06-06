import { fetcher, poster } from "@/lib/fetcher";
import { PlatesSchema, PlateSchema } from "./plateSchemas";
import { z } from "zod";

export function fetchPlates() {
  return fetcher("/plates", PlatesSchema);
}
export function createPlate(data: { name: string; price: number }) {
  return poster("/plates", data, PlateSchema);
}

export function updatePlate(id: string, data: { name: string; price: number }) {
  return poster(`/plates/${id}`, data, PlateSchema, { method: "PUT" });
}

export function deletePlate(id: string) {
  return poster(`/plates/${id}`, {}, z.any(), { method: "DELETE" });
}
