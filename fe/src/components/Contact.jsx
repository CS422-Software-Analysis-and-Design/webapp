import React from "react";

function Contact() {
  return (
    <div className="min-h-screen bg-purple-50 flex flex-col justify-between">
      {/* Main Content */}
      <main className="container mx-auto py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-700">Contact Us</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Information About Us */}
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">
              Information About us
            </h2>
            <p className="text-gray-500 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mattis
              neque ultrices mattis aliquam, malesuada diam est. Mauris enim
              tristique amet erat vitae eget dolor lobortis. Accumsan faucibus
              vitae lobortis quis bibendum quam.
            </p>
            <div className="flex space-x-4">
              <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
              <div className="w-4 h-4 bg-purple-700 rounded-full"></div>
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          {/* Contact Way */}
          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Contact Way</h2>
            <p className="text-gray-500">
              <strong>Tel:</strong> 877-67-88-99
            </p>
            <p className="text-gray-500">
              <strong>Email:</strong> shop@store.com
            </p>
            <p className="text-gray-500">
              20 Margaret St, London
              <br />
              Great Britain, 3NM98-LK
            </p>
            <p className="text-gray-500 mt-4">
              Support Forum: For over 24hr
            </p>
            <p className="text-gray-500">
              Free standard shipping on all orders.
            </p>
          </div>
        </div>

        {/* Get In Touch */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-700 mb-8 text-center">
            Get In Touch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name*"
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <input
                  type="email"
                  placeholder="Your E-mail*"
                  className="border border-gray-300 p-2 rounded w-full"
                />
              </div>
              <input
                type="text"
                placeholder="Subject*"
                className="border border-gray-300 p-2 rounded w-full"
              />
              <textarea
                placeholder="Type Your Message*"
                rows="4"
                className="border border-gray-300 p-2 rounded w-full"
              ></textarea>
              <button
                type="submit"
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-400"
              >
                Send Mail
              </button>
            </form>
            <div className="flex items-center justify-center">
              <img
                src="/assets/contact-illustration.png"
                alt="Contact Illustration"
                className="w-72"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
