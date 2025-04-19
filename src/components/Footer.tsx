import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Section 8 Real Estate</h3>
            <p className="text-gray-300">
              Find, analyze, and invest in Section 8 properties with confidence.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-white">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/chat" className="text-gray-300 hover:text-white">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/coaching" className="text-gray-300 hover:text-white">
                  Coaching
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-gray-300 hover:text-white">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-300 hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-300 hover:text-white">
                  Saved Properties
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Section 8 Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}