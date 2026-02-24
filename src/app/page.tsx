import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E9F0]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#5B7FFF] rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1A2B4A]">Cocycle</span>
          </div>
          <a
            href="#download"
            className="bg-[#5B7FFF] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#4A6FEF] transition-colors text-sm"
          >
            Get the App
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-[#1A2B4A] mb-6 leading-tight">
            Find people to ride with,<br />
            <span className="text-[#5B7FFF]">not just track rides alone</span>
          </h1>
          <p className="text-lg lg:text-xl text-[#6B7A90] mb-8 max-w-2xl mx-auto">
            Cocycle makes it effortless to discover, plan, and join cycling rides with others. 
            Because cycling is better together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#download"
              className="bg-[#5B7FFF] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#4A6FEF] transition-colors text-lg"
            >
              Download for iOS
            </a>
            <a
              href="#features"
              className="bg-white text-[#1A2B4A] font-semibold px-8 py-4 rounded-full border border-[#E5E9F0] hover:border-[#5B7FFF] transition-colors text-lg"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1A2B4A] text-center mb-12">
            Sound familiar?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: "Scattered group chats",
                description: "Planning rides across WhatsApp, Instagram, and Facebook is a mess"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Hard to find rides",
                description: "No easy way to discover planned rides happening near you"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Pace mismatches",
                description: "Joining a ride only to find out everyone's way faster (or slower)"
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#F5F7FA] rounded-2xl p-6 text-center">
                <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-[#1A2B4A] mb-2">{item.title}</h3>
                <p className="text-[#6B7A90] text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1A2B4A] text-center mb-4">
            Cycling made social
          </h2>
          <p className="text-[#6B7A90] text-center mb-12 max-w-2xl mx-auto">
            Cocycle is built for coordination, not competition. Plan rides, find companions, and enjoy the journey together.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <div className="w-12 h-12 bg-[#5B7FFF]/10 text-[#5B7FFF] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1A2B4A] text-xl mb-2">Discover rides near you</h3>
              <p className="text-[#6B7A90]">
                Browse upcoming rides in your area. Filter by distance, pace, and ride type to find your perfect match.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <div className="w-12 h-12 bg-[#5B7FFF]/10 text-[#5B7FFF] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1A2B4A] text-xl mb-2">Matched by level</h3>
              <p className="text-[#6B7A90]">
                See pace ranges upfront so you know what to expect. No more getting dropped or waiting around.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <div className="w-12 h-12 bg-[#FF8A5B]/10 text-[#FF8A5B] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 21v-2h18v2H2zm2-4v-6h14v6H4zm16-6h2v4h-2v-4zM6 3h12v2H6V3zm0 4h12v2H6V7z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1A2B4A] text-xl mb-2">Coffee is part of the ride</h3>
              <p className="text-[#6B7A90]">
                Rides can include café stops. Because the best conversations happen over a flat white.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1A2B4A] text-xl mb-2">Build routes together</h3>
              <p className="text-[#6B7A90]">
                Create and share routes with real road following. Save your favorites and reuse them anytime.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1A2B4A] text-xl mb-2">Join communities</h3>
              <p className="text-[#6B7A90]">
                Connect with local cycling groups. Find your tribe and ride together regularly.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <div className="w-12 h-12 bg-[#5B7FFF]/10 text-[#5B7FFF] rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-[#1A2B4A] text-xl mb-2">Ride chat built in</h3>
              <p className="text-[#6B7A90]">
                Coordinate with your group in the app. No more switching between apps to plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Positioning Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1A2B4A] mb-6">
            Strava is for recording rides.<br />
            <span className="text-[#5B7FFF]">Cocycle is for deciding who you ride with.</span>
          </h2>
          <p className="text-[#6B7A90] text-lg">
            We&apos;re not replacing your favorite tracking app. We&apos;re filling the gap between 
            riding solo and finding people to share the road with.
          </p>
        </div>
      </section>

      {/* Ride Types Section */}
      <section className="py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1A2B4A] text-center mb-4">
            Rides for every mood
          </h2>
          <p className="text-[#6B7A90] text-center mb-12">
            Whether you want to push hard or just cruise, there&apos;s a ride for you.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: "Social", color: "bg-[#5B7FFF]", desc: "Chat and ride" },
              { type: "Training", color: "bg-[#FF8A5B]", desc: "Push your limits" },
              { type: "Chill", color: "bg-green-500", desc: "Easy pace" },
              { type: "Fast", color: "bg-red-500", desc: "Full gas" },
            ].map((ride) => (
              <div key={ride.type} className="bg-white rounded-2xl p-5 text-center">
                <span className={`${ride.color} text-white text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-3`}>
                  {ride.type}
                </span>
                <p className="text-[#6B7A90] text-sm">{ride.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="download" className="py-16 lg:py-24 px-6 bg-[#5B7FFF]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to find your riding crew?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Download Cocycle and discover rides happening near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="bg-white text-[#5B7FFF] font-semibold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg inline-flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download for iOS
            </a>
            <div className="bg-white/20 text-white font-semibold px-8 py-4 rounded-full text-lg inline-flex items-center justify-center gap-2 cursor-not-allowed">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v17c0 .83-.67 1.5-1.5 1.5S3 21.33 3 20.5zM16.5 12L6 3.5v17l10.5-8.5zm1.5 0l-1.5 1.21V10.8L18 12z"/>
              </svg>
              Android coming soon
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2B4A] text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#5B7FFF] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold">Cocycle</span>
            </div>
            <div className="flex gap-6 text-white/60 text-sm">
              <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms</Link>
              <Link href="#" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            © {new Date().getFullYear()} Cocycle. Made for cyclists who&apos;d rather not ride alone.
          </div>
        </div>
      </footer>
    </main>
  );
}