import { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Send, Instagram, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import emailjs from '@emailjs/browser';

// =========================================================
// 🔧 EMAILJS SETUP — Replace these with your actual values
// =========================================================
// Step 1: Go to https://www.emailjs.com/ and create a free account
// Step 2: Add an Email Service (Gmail) → note your SERVICE_ID
// Step 3: Create an Email Template → note your TEMPLATE_ID
//         Template variables to use: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// Step 4: Copy your Public Key from Account → API Keys → PUBLIC_KEY
// =========================================================
const EMAILJS_SERVICE_ID  = 'service_lpjo9wd';   // e.g. 'service_abc123'
const EMAILJS_TEMPLATE_ID = 'template_16epc5d';  // e.g. 'template_xyz456'
const EMAILJS_PUBLIC_KEY  = 'D_pJADXIyI7J4E9UUqNhM';   // e.g. 'user_XXXXXXXXXXXXXXX'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { ref: leftRef, isInView: isLeftInView } = useInView({ threshold: 0.1, triggerOnce: true });
  const { ref: rightRef, isInView: isRightInView } = useInView({ threshold: 0.1, triggerOnce: true });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Check if EmailJS is configured (fallback to mailto if still using placeholder values)
    if (
      EMAILJS_SERVICE_ID.startsWith('YOUR_') ||
      EMAILJS_TEMPLATE_ID.startsWith('YOUR_') ||
      EMAILJS_PUBLIC_KEY.startsWith('YOUR_')
    ) {
      // Fallback: open email client if not configured yet
      const mailtoLink = `mailto:rahulrathore39769@gmail.com?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.location.href = mailtoLink;
      setIsSubmitting(false);
      setSubmitStatus('success');
      setTimeout(() => setSubmitStatus('idle'), 4000);
      return;
    }

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'rahulrathore39769@gmail.com',
          reply_to: formData.email,
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log('EmailJS success:', result);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('EmailJS error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    { icon: Mail,      label: 'Email',     value: 'rahulrathore39769@gmail.com',            href: 'mailto:rahulrathore39769@gmail.com',                 color: 'from-blue-500 to-cyan-500' },
    { icon: Phone,     label: 'Phone',     value: '+91 7505238914',                          href: 'tel:+917505238914',                                  color: 'from-green-500 to-teal-500' },
    { icon: Github,    label: 'GitHub',    value: 'rahulrathore579',                         href: 'https://github.com/rahulrathore579',                 color: 'from-gray-500 to-gray-700' },
    { icon: Linkedin,  label: 'LinkedIn',  value: 'rahulrathore39769',                       href: 'https://linkedin.com/in/rahulrathore39769',          color: 'from-blue-600 to-blue-800' },
    { icon: Instagram, label: 'Instagram', value: 'rahulrathore579',                         href: 'https://instagram.com/rahulrathore579',              color: 'from-pink-500 to-purple-600' }
  ];

  return (
    <section
      id="contact"
      className="py-24 px-4 scroll-reveal relative overflow-hidden bg-white dark:bg-gray-950"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_70%)]" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent pb-2 tracking-tight">
            Get In Touch
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-[0_0_20px_rgba(59,130,246,0.4)]" />
          <p className="mt-8 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-lg font-light">
            Let's connect and discuss how we can build{' '}
            <span className="text-blue-600 dark:text-blue-400 font-medium">something amazing</span> together
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Contact Info */}
          <div
            ref={leftRef}
            className={`space-y-6 transition-all duration-1000 transform ${isLeftInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            {/* Tagline */}
            <div className="relative p-7 rounded-2xl bg-gradient-to-br from-blue-500/8 to-purple-500/8 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200/50 dark:border-blue-500/20 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-3 right-3 text-blue-400/40"><Sparkles className="w-5 h-5" /></div>
              <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-white">
                Let's Build Something Amazing
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-5 text-sm leading-relaxed">
                I'm always interested in hearing about new projects and opportunities.
                Whether you have a question or just want to say hi, feel free to reach out!
              </p>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium text-sm">
                <MapPin className="w-4 h-4" />
                <span>Available for remote opportunities</span>
              </div>
            </div>

            {/* Contact Links */}
            <div className="space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <a
                    key={index}
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 hover:border-blue-400/50 dark:hover:border-blue-500/40 backdrop-blur-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group"
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <div className={`w-11 h-11 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">{info.label}</p>
                      <p className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">{info.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div
            ref={rightRef}
            className={`transition-all duration-1000 transform ${isRightInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            <div className="relative p-8 rounded-2xl bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 backdrop-blur-xl shadow-xl shadow-blue-500/5">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/3 to-purple-500/3 dark:from-blue-500/5 dark:to-purple-500/5 pointer-events-none" />
              <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white relative z-10">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Name</label>
                    <input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                    <input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleChange} required
                      className="w-full px-4 py-3 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Subject</label>
                  <input
                    type="text" id="subject" name="subject"
                    value={formData.subject} onChange={handleChange} required
                    className="w-full px-4 py-3 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 text-sm"
                    placeholder="How can I help you?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Message</label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange} required rows={5}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all resize-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 text-sm"
                    placeholder="Your message here..."
                  />
                </div>

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {/* Status messages */}
                {submitStatus === 'success' && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl text-green-700 dark:text-green-400 text-sm font-medium">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Message sent successfully! I'll get back to you soon. 🎉</span>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-red-700 dark:text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Failed to send message.</p>
                      <p className="text-xs mt-1 opacity-80">Please email directly: <a href="mailto:rahulrathore39769@gmail.com" className="underline">rahulrathore39769@gmail.com</a></p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <div className="inline-block px-8 py-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 backdrop-blur-sm">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
              © 2025 Rahul Rathore. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600">
              Built with React, TypeScript & TailwindCSS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
