import * as z from "zod";

export const userId = z.string();

export const user = z.object({
  id: userId,
  email: z.string().email(),
  address: z.string(),
  city: z.string(),
  zip: z.string(),
});

export type User = z.infer<typeof user>;
