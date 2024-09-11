import React from 'react';

const elcImg = "https://images.unsplash.com/photo-1579567761406-4684ee0c75b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHRlY2h8ZW58MHwxfDB8fHww";
const asImg = "https://images.unsplash.com/photo-1555448248-2571daf6344b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFic3RyYWN0fGVufDB8MXwwfHx8MA%3D%3D";
const yjywImg = "https://plus.unsplash.com/premium_photo-1664640458531-3c7cca2a9323?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YWJzdHJhY3R8ZW58MHwxfDB8fHww";

const Services = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-12 m-4">
      {/* Header Section */}
      <div className="text-center mb-16">
        <span className="bg-[#32CD32] text-black rounded-full px-4 py-1 mb-2 inline-block text-sm">
          Why Choose Us
        </span>
        <h1 className="text-4xl font-bold mt-4">
          The Only Sustainability Learning Platform You'll <span className="text-[#32CD32]">Ever Need</span>
        </h1>
        <p className="mt-4 text-lg">
          Explore a world of sustainable practices with our curated courses, expert-led workshops, and a passionate community.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Learning Dashboard */}
        <div className="col-span-1 md:col-span-2 p-6 rounded-lg"
          style={{
            background: '#1A1A1A', 
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px #333333',
            border: '1px solid #333333',
          }}>
          <h3 className="text-xl font-semibold mb-4">Learning Dashboard</h3>
          <p className="mb-4">Access a variety of courses and track your progress towards becoming a sustainability expert.</p>
          <div className="p-4 rounded-md space-y-4"
            style={{
              background: '#141414',
              backdropFilter: 'blur(20px)',
              border: '1px solid #333333'
            }}>
            <div className="flex items-center justify-between">
              <span>🌱 Complete "Introduction to Sustainable Living"</span>
              <button className="bg-[#32CD32] text-black px-2 py-1 rounded-full text-xs">Active</button>
            </div>
            <div className="flex items-center justify-between">
              <span>🌿 Join "Renewable Energy" Workshop</span>
              <button className="bg-[#32CD32] text-black px-2 py-1 rounded-full text-xs">Upcoming</button>
            </div>
          </div>
        </div>

        {/* Expert-Led Content */}
        <div className="row-span-2 p-6 rounded-lg flex flex-col"
          style={{
            background: '#1A1A1A',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px #333333',
            border: '1px solid #333333'
          }}>
          <h3 className="text-xl font-semibold mb-4">Expert-Led Content</h3>
          <p>Learn from the best in the field with content created by sustainability experts and thought leaders.</p>
          <div className="mt-4 flex-grow">
            <img src={elcImg} alt="Expert Content" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>

        {/* Affordable Subscription */}
        <div className="p-6 rounded-lg flex flex-col max-h-90"
          style={{
            background: '#1A1A1A',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px #333333',
            border: '1px solid #333333'
          }}>
          <h3 className="text-xl font-semibold mb-4">Affordable Subscription</h3>
          <p>Access all courses and resources with a simple, fixed monthly fee. No hidden charges.</p>
          <div className="mt-4 flex-grow">
            <img src={asImg} alt="Subscription" className="w-full h-full object-cover rounded-lg max-h-60" />
          </div>
        </div>

        {/* Your Journey, Your Way */}
        <div className="p-6 rounded-lg flex flex-col max-h-90"
          style={{
            background: '#1A1A1A',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px #333333',
            border: '1px solid #333333'
          }}>
          <h3 className="text-xl font-semibold mb-4">Your Journey, Your Way</h3>
          <p>Customize your learning experience and explore vast topics that matter most to you at the comfort of your home.</p>
          <div className="mt-4 flex-grow">
            <img src={yjywImg} alt="Customized Journey" className="w-full h-full object-cover rounded-lg max-h-60" />
          </div>
        </div>

        {/* Flexible Learning */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 p-6 rounded-lg flex items-center justify-between"
          style={{
            background: '#1A1A1A',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px #333333',
            border: '1px solid #333333'
          }}>
          <div>
            <h3 className="text-xl font-semibold mb-4">Flexible Learning</h3>
            <p>Learn at your own pace. Pause, resume, or even change your course at any time.</p>
          </div>
          <div className="flex items-center">
            <p className="text-sm mr-2">Your Membership is Active</p>
            <input type="checkbox" checked className="toggle toggle-green-ecco custom-toggle" />
          </div>
        </div>

        {/* Community Forum */}
        <div className="p-6 rounded-lg"
          style={{
            background: '#1A1A1A',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 20px #333333',
            border: '1px solid #333333'
          }}>
          <h3 className="text-xl font-semibold mb-4">Community Forum</h3>
          <p>Join our community to discuss, share, and collaborate on sustainable living practices.</p>
        </div>
      </div>
    </div>
  );
};

export default Services;