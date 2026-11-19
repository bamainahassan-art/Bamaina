import React, { useState } from 'react';
import { CheckCircle2, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { EditableSectionWrapper } from '../components/EditableSectionBar';
import { useSiteContent } from '../context/SiteContentContext';

export const ContactPage: React.FC = () => {
  const { content, buildWhatsAppLink } = useSiteContent();
  const { business, contact } = content;

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Livestock Farming');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<{
    fullName: string;
    phone: string;
    interest: string;
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!/^[+\d\s()-]{7,20}$/.test(trimmedPhone)) {
      setFormError('Please enter a valid telephone or WhatsApp number.');
      return;
    }
    if (trimmedMessage.length < 5) {
      setFormError('Please enter a brief enquiry message.');
      return;
    }

    setSubmittedEnquiry({
      fullName: trimmedName,
      phone: trimmedPhone,
      interest,
      message: trimmedMessage,
    });
    setFullName('');
    setPhone('');
    setMessage('');
  };

  return (
    <EditableSectionWrapper label="Contact Us Page" target={{ type: 'contact' }}>
      <div>
        {/* Page Header */}
        <section className="bg-[#0E3B25] text-white py-16 border-b border-[#DFB14B]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <p className="text-xs font-semibold text-[#DFB14B]">
              {business.location}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold max-w-3xl">
              {contact.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
              {contact.heroSubtitle}
            </p>
          </div>
        </section>

        {/* Main Contact Grid */}
        <section className="py-16 lg:py-20 bg-[#F4F7F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Direct Contact Info */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-xl border border-[#0E3B25]/12 p-7 space-y-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#8A6110]">
                      Reach Us Directly
                    </p>
                    <h2 className="font-display text-2xl font-bold text-[#0E3B25]">
                      {contact.directHeading}
                    </h2>
                    <p className="text-sm text-[#354B3E] leading-relaxed">
                      {contact.directDescription}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-[#0E3B25]/10">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F7F5] border border-[#0E3B25]/12 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-[#0E3B25]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#8A6110]">
                          Farm Location
                        </p>
                        <p className="text-sm font-semibold text-[#0E3B25]">
                          {business.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F7F5] border border-[#0E3B25]/12 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-[#0E3B25]" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#8A6110]">
                          Telephone
                        </p>
                        <a
                          href={business.phoneHref}
                          className="text-base font-bold text-[#0E3B25] hover:text-[#8A6110] transition-colors tabular-nums"
                        >
                          {business.phoneDisplay}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#F4F7F5] border border-[#0E3B25]/12 flex items-center justify-center shrink-0">
                        <MessageCircle
                          className="w-5 h-5 text-[#0E3B25]"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#8A6110]">
                          WhatsApp Desk
                        </p>
                        <a
                          href={buildWhatsAppLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-bold text-[#0E3B25] hover:text-[#8A6110] transition-colors tabular-nums"
                        >
                          {business.whatsappNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prominent WhatsApp Action Card */}
                <div className="bg-[#0E3B25] text-white rounded-xl p-7 space-y-4 border border-[#DFB14B]/40">
                  <h3 className="font-display text-xl font-bold text-white">
                    {contact.whatsappBannerHeading}
                  </h3>
                  <p className="text-sm text-white/85 leading-relaxed">
                    {contact.whatsappBannerText}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href={buildWhatsAppLink(
                        `Hello ${business.name}, I would like to make an enquiry.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#C8962E] text-[#082315] text-sm font-semibold hover:bg-[#DFB14B] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>Chat on WhatsApp</span>
                    </a>
                    <a
                      href={business.phoneHref}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/10 border border-white/25 text-white text-sm font-semibold hover:bg-white/20 transition-colors tabular-nums"
                    >
                      <Phone className="w-4 h-4 text-[#DFB14B]" aria-hidden="true" />
                      <span>Call {business.phoneDisplay}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Enquiry Form */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-[#0E3B25]/12 p-7 sm:p-9 space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#8A6110]">
                    Enquiry Form
                  </p>
                  <h2 className="font-display text-3xl font-bold text-[#0E3B25]">
                    {contact.formHeading}
                  </h2>
                  <p className="text-sm text-[#354B3E] leading-relaxed">
                    {contact.formDescription}
                  </p>
                </div>

                {submittedEnquiry && (
                  <div
                    role="status"
                    className="p-5 rounded-xl bg-[#F4F7F5] border border-[#0E3B25]/25 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="w-5 h-5 text-[#0E3B25] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <div className="space-y-1">
                        <h3 className="font-display text-base font-bold text-[#0E3B25]">
                          Enquiry Prepared Successfully
                        </h3>
                        <p className="text-sm text-[#354B3E]">
                          Thank you, {submittedEnquiry.fullName}. Your enquiry regarding{' '}
                          <span className="font-semibold text-[#0E3B25]">
                            {submittedEnquiry.interest}
                          </span>{' '}
                          has been recorded. Send it straight to our WhatsApp desk for
                          immediate response, or call {business.phoneDisplay}.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 pl-8">
                      <a
                        href={buildWhatsAppLink(
                          `Hello ${business.name},\nName: ${submittedEnquiry.fullName}\nPhone: ${submittedEnquiry.phone}\nDivision: ${submittedEnquiry.interest}\nEnquiry: ${submittedEnquiry.message}`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0E3B25] text-white text-xs font-semibold hover:bg-[#145333]"
                      >
                        <MessageCircle className="w-4 h-4 text-[#DFB14B]" aria-hidden="true" />
                        <span>Send This Enquiry via WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

                {formError && (
                  <div
                    role="alert"
                    className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                  >
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-semibold text-[#0E3B25] mb-1.5"
                      >
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm text-[#14241B] focus:border-[#0E3B25]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-semibold text-[#0E3B25] mb-1.5"
                      >
                        Phone / WhatsApp Number *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 08065494739"
                        className="w-full px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm text-[#14241B] focus:border-[#0E3B25]"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-interest"
                      className="block text-xs font-semibold text-[#0E3B25] mb-1.5"
                    >
                      Area of Interest
                    </label>
                    <select
                      id="contact-interest"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm text-[#14241B] bg-white focus:border-[#0E3B25]"
                    >
                      <option value="Livestock Farming">Livestock Farming</option>
                      <option value="Poultry Farming">Poultry Farming</option>
                      <option value="Fish Farming">Fish Farming</option>
                      <option value="General Farm Enquiry">General Farm Enquiry</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-semibold text-[#0E3B25] mb-1.5"
                    >
                      Enquiry Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your enquiry regarding livestock, poultry, or fish farming..."
                      className="w-full px-4 py-2.5 rounded-lg border border-[#0E3B25]/20 text-sm text-[#14241B] focus:border-[#0E3B25]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0E3B25] text-white text-sm font-semibold hover:bg-[#145333] transition-colors cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-[#DFB14B]" aria-hidden="true" />
                      <span>Submit Enquiry</span>
                    </button>
                    <span className="text-xs text-[#354B3E]">
                      Or message{' '}
                      <a
                        href={buildWhatsAppLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#0E3B25] underline"
                      >
                        {business.whatsappNumber}
                      </a>{' '}
                      directly.
                    </span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </EditableSectionWrapper>
  );
};
