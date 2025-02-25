export const isAuthPage = (pathname: string): boolean => {
  const authPaths = ["/", "/login", "/signup", "/forgot-password"];
  return authPaths.includes(pathname);
};
