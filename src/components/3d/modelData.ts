import type { ModelRoom } from "@/components/3d/ModelViewer";

export interface PropertyModel {
  glb: string;
  rooms: ModelRoom[];
  tris: number;
}

/**
 * Registry of 3D models per property.
 *
 * GLB paths are served from `public/3d/` once real photogrammetry outputs are
 * available.
 * Object names inside each GLB must match `objectNames` so the cutaway
 * toggle can hide individual rooms.
 */
export const propertyModels: Record<string, PropertyModel> = {};

export function modelFor(propertyId: string): PropertyModel | null {
  return propertyModels[propertyId] ?? null;
}