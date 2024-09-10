import React from 'react';

const Services = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12">
      {/* Header Section */}
      <div className="text-center mb-16">
        <span className="bg-green-ecco text-black rounded-full px-4 py-1 mb-2 inline-block text-sm">
          Why Choose Us
        </span>
        <h1 className="text-4xl font-bold mt-4">
          The Only Sustainability Learning Platform You'll <span className="text-green-ecco">Ever Need</span>
        </h1>
        <p className="mt-4 text-lg">
          Explore a world of sustainable practices with our curated courses, expert-led workshops, and a passionate community.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Learning Dashboard */}
        <div className="col-span-1 md:col-span-2 bg-black border border-white/20 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Learning Dashboard</h3>
          <p className="mb-4">Access a variety of courses and track your progress towards becoming a sustainability expert.</p>
          <div className="bg-black border border-white/20 p-4 rounded-md space-y-4">
            <div className="flex items-center justify-between">
              <span>🌱 Complete "Introduction to Sustainable Living"</span>
              <button className="bg-green-ecco text-black px-2 py-1 rounded-full text-xs">In Progress</button>
            </div>
            <div className="flex items-center justify-between">
              <span>🌿 Join "Renewable Energy" Workshop</span>
              <button className="bg-green-ecco text-black px-2 py-1 rounded-full text-xs">Upcoming</button>
            </div>
          </div>
        </div>

        {/* Expert-Led Content - Spanning vertically across two rows */}
        <div className="row-span-2 bg-black border border-white/20 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Expert-Led Content</h3>
          <p>Learn from the best in the field with content created by sustainability experts and thought leaders.</p>
          <div className="mt-4">
            <img src="your-expert-image-url.png" alt="Expert Content" className="w-full h-32 object-cover" />
          </div>
        </div>

        {/* Affordable Subscription */}
        <div className="bg-black border border-white/20 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Affordable Subscription</h3>
          <p>Access all courses and resources with a simple, fixed monthly fee. No hidden charges.</p>
          <div className="mt-4">
            <img src="your-subscription-image-url.png" alt="Subscription" className="w-full h-32 object-cover" />
          </div>
        </div>

        {/* Your Journey, Your Way */}
        <div className="bg-black border border-white/20 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Your Journey, Your Way</h3>
          <p>Customize your learning path and explore topics that matter most to you.</p>
          <div className="mt-4">
            <img src="your-journey-image-url.png" alt="Customized Journey" className="w-full h-32 object-cover" />
          </div>
        </div>

        {/* Flexible Learning - Spanning two columns horizontally */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-black border border-white/20 p-6 rounded-lg shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4">Flexible Learning</h3>
            <p>Learn at your own pace. Pause, resume, or even change your course at any time.</p>
          </div>
          <div className="flex items-center">
            <p className="text-sm mr-2">Your Membership is Active</p>
            <input type="checkbox" checked className="toggle toggle-green-ecco" />
          </div>
        </div>

        <div className="bg-black border border-white/20 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Community Forum</h3>
          <p>Join our community to discuss, share, and collaborate on sustainable living practices.</p>
        </div>
      </div>
    </div>
  );
};

export default Services;
