"use client";

import { formatDate } from "@/lib/utils";
import { WorkshopData } from "@/types";

interface WorkshopHeroProps {
  workshop: WorkshopData;
  onRegisterClick?: () => void;
  isAuthenticated: boolean;
}

export function WorkshopHero({
  workshop,
  onRegisterClick,
  isAuthenticated,
}: WorkshopHeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column */}
          <div>
            <h1 className="text-5xl font-bold mb-4">{workshop.title}</h1>
            <p className="text-xl mb-6 text-blue-100">{workshop.description}</p>

            {/* Quick Details */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📅</span>
                <span>{formatDate(new Date(workshop.date))}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🕐</span>
                <span>
                  {workshop.startTime} - {workshop.endTime}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📍</span>
                <span>{workshop.location}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <button
                onClick={onRegisterClick}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                Register Now
              </button>
            ) : (
              <a
                href="/login"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition"
              >
                Sign In to Register
              </a>
            )}
          </div>

          {/* Right Column - Pricing Card */}
          <div className="bg-white text-gray-900 rounded-lg p-8 shadow-2xl">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Workshop Fee</p>
              <div className="text-5xl font-bold text-blue-600 mb-4">
                ₹{(workshop.price / 100).toFixed(2)}
              </div>
              <p className="text-gray-600 mb-6">
                Limited spots available: {workshop.capacity}
              </p>

              <div className="space-y-3 text-left bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">
                  What You&apos;ll Learn:
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Industry best practices</li>
                  <li>✓ Hands-on practical training</li>
                  <li>✓ Expert guidance from professionals</li>
                  <li>✓ Certificate of completion</li>
                  <li>✓ Lifetime access to materials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
