export function routeForRole(role: string): string {
  if (role === "ADMIN") return "/admin";
  if (role === "SELLER") return "/dashboard";
  return "/library";
}
