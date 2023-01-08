import * as z from "zod";

export const itemId = z.string();

export const item = z.object({
  id: itemId,
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().int().min(0),
  currency: z.enum(["EUR", "USD"]),
  quantity: z.number().int().min(0),
});

export type Item = z.infer<typeof item>;
