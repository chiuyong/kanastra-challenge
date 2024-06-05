import { ReactElement } from "react";
import { Link, Outlet } from "react-router-dom";

function Layout(): ReactElement {
  return (
    <>
      <header className="p-4 bg-gray-800 text-white">
        <nav>
          <ul className="flex gap-4">
            <li>
              <Link to="/" className="hover:underline">
                List Files
              </Link>
            </li>
            <li>
              <Link to="/upload" className="hover:underline">
                Upload File
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="p-6 flex flex-col gap-8">
        <Outlet />
      </main>
    </>
  );
}

export { Layout };
