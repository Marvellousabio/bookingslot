import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Book Your Perfect Space
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Find and reserve coworking spaces, meeting rooms, event venues, and conference halls.
        </p>
        <div className="space-x-4 flex flex-col sm:flex-row justify-center">
          <Link href="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 mb-4 sm:mb-0">
            Get Started
          </Link>
          <Link href="/booking" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
            Browse Spaces
          </Link>
        </div>
      </div>
    </section>
  );
}