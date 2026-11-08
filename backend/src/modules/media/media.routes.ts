import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/database.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { HttpError } from "../../middleware/error.middleware.js";

export const mediaRouter = Router();

mediaRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const id = z.string().uuid().parse(req.params.id);
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
      select: { content: true, mimeType: true, size: true },
    });
    if (!asset || !asset.content) throw new HttpError(404, "File not found");

    res.set({
      "Content-Type": asset.mimeType,
      "Content-Length": String(asset.size),
      // s-maxage lets the Vercel CDN keep the bytes; without it every view re-runs
      // this function and counts toward Fast Origin Transfer. Ids are UUIDs, so
      // the content never changes under the same URL.
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    });
    return res.send(Buffer.from(asset.content));
  }),
);