import { MapPin, Phone, Mail, Clock, Award } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    service: "General Inquiry",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent successfully.");
    // Here you can connect to backend or email service later
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      service: "General Inquiry",
    });
  };

  return (
    <div className="pt-20 pb-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-2xl text-emerald-700">
            We're here to help power your solar project
          </p>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Whether you're planning a residential installation, commercial
            project, or utility-scale solar farm — our team is ready to support
            you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-3xl font-semibold mb-8">
                Contact Information
              </h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Head Office</h3>
                    <p className="text-gray-600">
                      No. 123, Street 110, Phnom Penh, Cambodia
                      <br />
                      Toul Kork District
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone</h3>
                    <p className="text-gray-600">
                      +855 23 456 789
                      <br />
                      +855 12 345 678
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email</h3>
                    <p className="text-gray-600">
                      info@energytracker.asia
                      <br />
                      projects@energytracker.asia
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 5:00 PM
                      <br />
                      Saturday: 9:00 AM - 12:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white p-8 rounded-3xl shadow">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-emerald-600" />
                <h3 className="font-semibold text-xl">Why Choose Us?</h3>
              </div>
              <ul className="space-y-4 text-gray-700">
                <li>✓ 10+ years experience in Southeast Asia</li>
                <li>✓ Certified solar engineers</li>
                <li>✓ End-to-end project support</li>
                <li>✓ Fast response time (within 24 hours)</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl p-10">
              <h2 className="text-3xl font-semibold mb-8">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Interested In
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Residential Solar">
                      Residential Solar Installation
                    </option>
                    <option value="Commercial Solar">
                      Commercial / Rooftop Solar
                    </option>
                    <option value="Utility Scale">Utility Scale Project</option>
                    <option value="Consulting">Engineering Consultation</option>
                    <option value="Partnership">Business Partnership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full px-5 py-4 border border-gray-200 rounded-3xl focus:outline-none focus:border-emerald-500 resize-y"
                    placeholder="Please describe your project or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-semibold text-lg transition"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Visit Our Office
          </h2>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.0!2d104.90!3d11.57!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTHCsDM0JzEyLjAiTiAxMDTCsDU0JzAwLjAiRQ!5e0!3m2!1sen!2skh!4v1690000000000"
              width="100%"
              height="520"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="w-full"
            ></iframe>
          </div>

          <div className="text-center mt-6">
            <p className="font-medium">
              No. 123, Street 110, Toul Kork, Phnom Penh
            </p>
            <p className="text-emerald-600">
             5 minutes from AEON Mall Toul Kork
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
