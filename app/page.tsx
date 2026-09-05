"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { WorkshopHero } from "@/components/WorkshopHero";
import { LoadingState, ErrorState, EmptyState } from "@/components/States";
import { WorkshopData } from "@/types";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [workshop, setWorkshop] = useState<WorkshopData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const res = await fetch("/api/workshops");
        const data = await res.json();

        if (!data.success) {
          setError(data.error || "Failed to load workshop");
          return;
        }

        setWorkshop(data.data);
      } catch (err) {
        setError("Failed to load workshop details");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshop();
  }, []);

  const handleRegister = () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (workshop) {
      router.push(`/register?workshopId=${workshop.id}`);
    }
  };

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <ErrorState
        title="Cannot Load Workshop"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!workshop) {
    return (
      <EmptyState
        title="No Workshop Available"
        message="There are currently no active workshops available for registration."
        icon="🛑"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <WorkshopHero
        workshop={workshop}
        onRegisterClick={handleRegister}
        isAuthenticated={!!session?.user}
      />

      {/* FAQ Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            {[
              {
                q: "What should I bring to the workshop?",
                a: "Please bring a laptop with necessary development tools pre-installed, and a valid ID. We'll provide all course materials.",
              },
              {
                q: "Is there a refund policy?",
                a: "Yes, we offer a full refund if you cancel at least 7 days before the workshop date. For cancellations within 7 days, we offer 50% refund.",
              },
              {
                q: "Will I get a certificate?",
                a: "Yes, all attendees who complete the workshop will receive a certificate of completion via email.",
              },
              {
                q: "Can I attend if I'm a beginner?",
                a: "Absolutely! This workshop is designed for both beginners and intermediate developers. We'll cover fundamentals and advanced topics.",
              },
              {
                q: "What if I need to cancel?",
                a: "You can cancel your registration from your dashboard anytime. Contact our support team at support@workshop.dev for assistance.",
              },
              {
                q: "Is food and beverages included?",
                a: "Yes! We provide breakfast, lunch, and refreshments throughout the workshop day.",
              },
            ].map((item, index) => (
              <details
                key={index}
                className="group border border-gray-300 rounded-lg p-6 hover:border-blue-500 cursor-pointer"
              >
                <summary className="font-semibold text-gray-900 text-lg flex justify-between items-center">
                  {item.q}
                  <span className="transform group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="mt-4 text-gray-700">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-blue-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Attend?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Industry Experts",
                desc: "Learn from professionals with 10+ years of experience",
              },
              {
                icon: "💻",
                title: "Hands-On Training",
                desc: "Get practical experience with real-world projects",
              },
              {
                icon: "📚",
                title: "Lifetime Access",
                desc: "Access all course materials and recordings forever",
              },
              {
                icon: "🏆",
                title: "Certificate",
                desc: "Earn a recognized certificate of completion",
              },
              {
                icon: "🤝",
                title: "Networking",
                desc: "Connect with like-minded professionals and peers",
              },
              {
                icon: "💼",
                title: "Career Support",
                desc: "Get job leads and career guidance from mentors",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Join?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Limited seats available. Register now to secure your spot!
          </p>
          <button
            onClick={handleRegister}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition text-lg"
          >
            {session?.user ? "Register Now" : "Sign In to Register"}
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 Workshop Registration Platform. All rights reserved.</p>
          <p className="text-gray-400 mt-2">For inquiries: support@workshop.dev</p>
        </div>
      </footer>
    </div>
  );
}
