import asyncHandler from "../utils/asyncHandler.js";
import * as resourceService from "../services/resourceService.js";

export const getResources = asyncHandler(async (req, res) => {
  const { course } = req.query;
  const resources = await resourceService.getResources(course);
  res.json({ success: true, data: resources });
});

export const createResource = asyncHandler(async (req, res) => {
  const resource = await resourceService.createResource(req.currentUser, req.body);
  res.status(201).json({ success: true, data: resource });
});

export const deleteResource = asyncHandler(async (req, res) => {
  await resourceService.deleteResource(req.params.id, req.currentUser);
  res.json({ success: true, message: "Resource deleted." });
});

export const upvoteResource = asyncHandler(async (req, res) => {
  const resource = await resourceService.upvoteResource(req.params.id, req.currentUser);
  res.json({ success: true, data: resource });
});
