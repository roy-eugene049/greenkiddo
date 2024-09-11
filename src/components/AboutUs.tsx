import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-black p-8 flex justify-center items-center">
      <div className="grid grid-cols-3 grid-rows-8 gap-4" style={{ width: '100%', maxWidth: '800px' }}>
        {/* Intro Section */}
        <div className="flex flex-col items-center justify-center text-center text-white px-6" style={{ gridColumn: '1 / span 3', gridRow: '1 / span 3' }}>
          <h1 className="text-3xl font-bold text-center">
            <strong className="text-green-ecco">Green Kiddo</strong> - A Gateway to a Sustainable Future.
          </h1>
          <p className="text-lg mt-2">
            Green Kiddo's Platform provides the learner experience and knowledge to 
            <strong className="text-green-ecco"> spearhead</strong>, <strong className="text-green-ecco">adopt</strong>, and <strong className="text-green-ecco">practice</strong> sustainability, 
            glocally.
          </p>
        </div>

        {/* Key Points */}
        {[
          { title: "Easy.", description: "Learning and adopting sustainability.", icon: "🌱" },
          { title: "Universal.", description: "To inspire change, we have worldwide accessibility.", icon: "🌍" },
          { title: "Accessible.", description: "Designed for everyone to have an inclusive learning experience.", icon: "🧑‍🤝‍🧑" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center text-center text-white" style={{ gridColumn: `${index + 1} / span 1`, gridRow: '4 / span 1' }}>
            <div className="text-4xl mb-2">{item.icon}</div>
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="text-md px-2">{item.description}</p>
          </div>
        ))}

        {/* Investor Section */}
        <div className="flex flex-col items-center justify-center text-center text-white" style={{ gridColumn: '1 / span 3', gridRow: '5 / span 1' }}>
          <h2 className="text-2xl font-bold">Backed by Incredible Investors</h2>
        </div>

        {/* Investor Logos */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center justify-center text-white" style={{ gridColumn: `${index + 1} / span 1`, gridRow: '6 / span 1', height: '150px' }}>
            <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gray-500">
              <p>Logo {index + 1}</p>
            </div>
          </div>
        ))}

        {/* Founder Section */}
        <div className="flex flex-col items-center justify-center text-center text-white" style={{ gridColumn: '1 / span 3', gridRow: '7 / span 1' }}>
          <h2 className="text-2xl font-bold">A Word From Our Founder</h2>
        </div>

        {/* Avatar, Name, and Profession */}
        <div className="flex flex-col items-center justify-center text-center text-white" style={{ gridColumn: '2 / span 1', gridRow: '8 / span 1' }}>
          {/* Avatar */}
          <img src="/founder.jpg" alt="Founder Avatar" className="rounded-full h-24 w-24 mb-2 object-cover" />

          {/* Founder Name and Profession */}
          <h3 className="text-xl font-bold">Roy Eugene</h3>
          <p className="text-md italic">Software Engineer</p>
        </div>

        {/* Founder Remarks */}
        <div className="flex flex-col items-center justify-center text-center text-white italic" style={{ gridColumn: '1 / span 3', gridRow: '9 / span 3', width: '75%', margin: '0 auto' }}>
          <p className="text-green-ecco mb-4">
            "At Green Kiddo, we strive to create a platform that empowers individuals to become champions of sustainability, driving change in their communities and around the world."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
