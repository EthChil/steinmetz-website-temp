import React, { useState, useEffect } from 'react';
import { getCalApi } from "@calcom/embed-react";
// import '../styles/cal-embed.css';

interface ContactFormProps {
  onClose: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    jobTitle: '',
    companyHeadquarters: '',
    unitVolume: '',
    usageDetails: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Update Cal.com initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    (async function () {
      try {
        const Cal = await getCalApi();
        Cal("ui", {
          theme: "dark",
          hideEventTypeDetails: false,
          cssVarsPerTheme: {
            light: {
              "cal-brand": "#059669",
              "cal-text": "#374151",
              "cal-text-emphasis": "#111827",
              "cal-border-emphasis": "#9CA3AF",
              "cal-text-error": "#752522",
              "cal-border": "#D1D5DB",
              "cal-border-default": "#D1D5DB",
              "cal-border-subtle": "#E5E7EB",
              "cal-border-booker": "#E5E7EB",
              "cal-text-muted": "#9CA3AF",
              "cal-bg": "#ffffff",
              "cal-bg-emphasis": "#F9FAFB",
              "cal-bg-subtle": "#F3F4F6",
              "cal-bg-muted": "#F3F4F6",
              "cal-bg-inverted": "#111827"
            },
            dark: {
              "cal-brand": "#059669",
              "cal-text": "#374151",
              "cal-text-emphasis": "#FFFFFF",
              "cal-border-emphasis": "#2B2B2B",
              "cal-text-error": "#752522",
              "cal-border": "#2B2B2B",
              "cal-border-default": "#2B2B2B",
              "cal-border-subtle": "#2B2B2B",
              "cal-border-booker": "#2B2B2B",
              "cal-text-muted": "#575757",
              "cal-bg": "#000000",
              "cal-bg-emphasis": "#101010",
              "cal-bg-subtle": "#1C1C1C",
              "cal-bg-muted": "#101010",
              "cal-bg-inverted": "#FFFFFF"
            }
          }
        });
      } catch (error) {
        console.error('Failed to initialize Cal.com:', error);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Remove Supabase submission and only keep email API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Email API submission failed');
      
      setSubmitStatus('success');
    //   setShowBooking(true);

    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Custom Cursor */}
      {/* <div 
        className="fixed w-4 h-4 bg-zinc-400 rounded-full pointer-events-none z-[60]" 
        style={{ 
          left: `${cursorPosition.x}px`, 
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}  */}
      

      <div className={`bg-black border border-zinc-800/80 p-6 rounded-lg mx-4 max-h-[90vh] overflow-y-auto w-full max-w-[600px]`}>
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl text-zinc-200 uppercase tracking-wide">Contact Us</h2>
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200 text-md md:text-md scale-[2] md:scale-100">

                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase text-zinc-500 mb-1 block">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    required
                    className="w-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 p-2 rounded-md focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="text-xs uppercase text-zinc-500 mb-1 block">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Smith"
                    required
                    className="w-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 p-2 rounded-md focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase text-zinc-500 mb-1 block">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="john.smith@company.com"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 p-2 rounded-md focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs uppercase text-zinc-500 mb-1 block">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Future Motors Corporation"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 p-2 rounded-md focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs uppercase text-zinc-500 mb-1 block">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Hardware Engineer"
                  className="w-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 p-2 rounded-md focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs uppercase text-zinc-500 mb-1 block">Company Location</label>
                <input
                  type="text"
                  name="companyHeadquarters"
                  placeholder="San Francisco, CA"
                  className="w-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 p-2 rounded-md focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs uppercase text-zinc-500 mb-1 block">Unit Volume</label>
                <div className="relative">
                  <select
                    name="unitVolume"
                    className={`w-full bg-zinc-900/80 border border-zinc-800/80 p-2 pr-8 rounded-md focus:outline-none focus:border-zinc-700 appearance-none ${formData.unitVolume === '' ? 'text-zinc-600' : 'text-zinc-200'}`}
                    onChange={handleChange}
                    value={formData.unitVolume}
                  >
                    <option value="" disabled>Select unit volume</option>
                    <option value="low volume">&lt;10 units</option>
                    <option value="medium volume">10-1,000 units</option>
                    <option value="high volume">1,000-10,000 units</option>
                    <option value="extreme volume">&gt;10,000 units</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 text-zinc-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase text-zinc-500 mb-1 block">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="usageDetails"
                  placeholder="Interest in Steinmetz's solutions"
                  required
                  className="w-full bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 p-2 rounded-md focus:outline-none focus:border-zinc-700 h-24 placeholder:text-zinc-600"
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full uppercase tracking-wide bg-orange-900/30 border border-orange-900/40 hover:bg-orange-700 text-orange-500 p-2 rounded disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-500 text-center">Message sent successfully!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
              )}
            </form>
          </>
      </div>
    </div>
  );
};

export default ContactForm; 