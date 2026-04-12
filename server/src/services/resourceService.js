import * as resourceRepo from "../repositories/resourceRepository.js";

export const getResources = (course) => resourceRepo.findAllResources(course);

export const createResource = (user, body) => {
  return resourceRepo.createResource({
    ...body,
    author: user._id,
    authorUsername: user.username,
  });
};

export const deleteResource = async (id, user) => {
  const resource = await resourceRepo.findResourceById(id);
  if (!resource) throw Object.assign(new Error("Resource not found."), { status: 404 });
  if (String(resource.author) !== String(user._id) && user.role !== "admin") {
    throw Object.assign(new Error("Not authorized."), { status: 403 });
  }
  return resourceRepo.deleteResource(id);
};

export const upvoteResource = async (id, user) => {
  const resource = await resourceRepo.toggleUpvote(id, user._id);
  if (!resource) throw Object.assign(new Error("Resource not found."), { status: 404 });
  return resource;
};
