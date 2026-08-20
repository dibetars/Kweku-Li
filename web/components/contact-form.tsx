'use client';

import { useRef } from 'react';

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const service = String(data.get('service') ?? '');
    const message = String(data.get('message') ?? '').trim();

    if (!name || !email || !service || !message) {
      form.reportValidity();
      return;
    }

    const subject = `New inquiry: ${service} - ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${data.get('phone') ?? ''}`,
      `Company: ${data.get('company') ?? ''}`,
      `Service: ${service}`,
      `Timeline: ${data.get('timeline') ?? ''}`,
      `Budget: ${data.get('budget') ?? ''}`,
      `Location: ${data.get('location') ?? ''}`,
      '',
      'Details:',
      message,
    ]
      .filter(Boolean)
      .join('\n');

    window.location.href = `mailto:the1qweicue@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines)}`;
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" placeholder="Name" required className="rounded-lg border border-neutral-300 px-4 py-2" />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="rounded-lg border border-neutral-300 px-4 py-2"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="phone" placeholder="Phone (optional)" className="rounded-lg border border-neutral-300 px-4 py-2" />
        <input name="company" placeholder="Company (optional)" className="rounded-lg border border-neutral-300 px-4 py-2" />
      </div>
      <select name="service" required defaultValue="" className="w-full rounded-lg border border-neutral-300 px-4 py-2">
        <option value="" disabled>
          Select a service
        </option>
        <option>Photography & Visual Communication</option>
        <option>Copywriting & Content Creation</option>
        <option>Marketing Strategy & Campaign Management</option>
        <option>Creative Direction & Art Direction</option>
        <option>Cultural Projects & Collaborations</option>
        <option>Spoken Word Performances</option>
        <option>Speaking Engagements & Workshops</option>
        <option>Video Production & Scriptwriting</option>
      </select>
      <textarea
        name="message"
        placeholder="Tell me about your project"
        required
        rows={5}
        className="w-full rounded-lg border border-neutral-300 px-4 py-2"
      />
      <button type="submit" className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800">
        Send Message
      </button>
    </form>
  );
}
