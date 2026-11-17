// Teen roles jo poore app me use honge
export const ROLES = {
  USER: "user",
  VENDOR: "vendor",
  ADMIN: "admin",
};

// Login/signup ke baad har role kahan jayega
export function getHomePath(role) {
  if (role === ROLES.ADMIN) return "/admin";
  if (role === ROLES.VENDOR) return "/vendor-dashboard";
  return "/";
}
