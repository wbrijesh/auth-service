import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface DocLayoutProps {
  children: ReactNode;
}

export function DocLayout({ children }: DocLayoutProps) {
  const { pathname } = useLocation();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar navigation */}
        <div className="w-full lg:w-64 min-w-[16rem] flex-shrink-0 mb-8 lg:mb-0">
          <div className="sticky top-8">
            <h3 className="font-bold text-lg mb-4">Aegis Documentation</h3>
            <nav className="space-y-1">
              <Link
                to="/docs"
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive("/docs")
                    ? "bg-sky-600 text-white"
                    : "text-gray-300 hover:bg-neutral-800"
                }`}
              >
                Overview
              </Link>
              <Link
                to="/docs/getting-started"
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive("/docs/getting-started")
                    ? "bg-sky-600 text-white"
                    : "text-gray-300 hover:bg-neutral-800"
                }`}
              >
                Getting Started
              </Link>
              <Link
                to="/docs/application-setup"
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive("/docs/application-setup")
                  ? "bg-sky-600 text-white"
                  : "text-gray-300 hover:bg-neutral-800"
                }`}
              >
                Application Setup
              </Link>
              <Link
                to="/docs/register-login"
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive("/docs/register-login")
                    ? "bg-sky-600 text-white"
                    : "text-gray-300 hover:bg-neutral-800"
                }`}
              >
                Register & Login
              </Link>
              <Link
                to="/docs/user-details"
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive("/docs/user-details")
                    ? "bg-sky-600 text-white"
                    : "text-gray-300 hover:bg-neutral-800"
                }`}
              >
                User Details
              </Link>
              <Link
                to="/docs/api"
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive("/docs/api")
                    ? "bg-sky-600 text-white"
                    : "text-gray-300 hover:bg-neutral-800"
                }`}
              >
                API Reference
              </Link>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:flex-1 lg:ml-8 w-full overflow-x-auto">
          <div className="prose prose-invert max-w-none">{children}</div>
        </div>
      </div>
    </div>
  );
}
