import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold text-center text-gray-900">
            Section 8 Real Estate Analysis
          </h1>
          <p className="mt-3 text-center text-gray-600">
            Find, analyze, and save Section 8 investment properties
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <Link href="/properties" className="btn btn-primary w-full flex justify-center">
            Browse Properties
          </Link>
          <Link href="/login" className="btn btn-secondary w-full flex justify-center">
            Login / Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}