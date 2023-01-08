import * as z from "zod";

import { itemId } from "./itemSchema";
import { userId } from "./userSchema";

export const orderId = z.string();

export const order = z.object({
  id: orderId,
  userId: userId,
  products: z
    .array(
      z.object({
        itemId,
        quantity: z.number().min(1),
      })
    )
    .min(1),
  datetime: z.date(),
});

export type Order = z.infer<typeof order>;
