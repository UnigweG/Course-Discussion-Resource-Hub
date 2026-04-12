import Resource from "../models/Resource.js";

export const findAllResources = (course) => {
  const filter = course ? { course: new RegExp(course, "i") } : {};
  return Resource.find(filter).sort({ createdAt: -1 });
};

export const findResourceById = (id) => Resource.findById(id);

export const createResource = (data) => Resource.create(data);

export const deleteResource = (id) => Resource.findByIdAndDelete(id);

export const toggleUpvote = async (resourceId, userId) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) return null;

  const alreadyUpvoted = resource.upvotes.includes(userId);
  if (alreadyUpvoted) {
    resource.upvotes.pull(userId);
  } else {
    resource.upvotes.push(userId);
  }
  await resource.save();
  return resource;
};
