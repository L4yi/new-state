import React from 'react';

export default function GenericPage({ title, description }) {
  return (
    <div className="pt-[72px] min-h-screen bg-[#F9FCFA]">
      <section className="bg-green-primary text-white py-16 px-6">
        <div className="max-w-[1280px] mx-auto text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-green-light max-w-2xl mx-auto">{description}</p>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto py-16 px-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center text-center">
          <div>
            <h3 className="text-xl font-bold text-green-primary mb-2">{title} Content Section</h3>
            <p className="text-gray-500 max-w-md">
              This section is configured and ready for tailored content for New State High School's {title.toLowerCase()} details.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
