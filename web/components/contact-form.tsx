'use client';

import { useActionState, useEffect, useRef } from 'react';
import { submitContactAction, type ContactResult } from '@/app/contact-actions';
import { SERVICE_OPTIONS } from '@/lib/site-defaults';

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState<ContactResult | null, FormData>(submitContactAction, null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  const fieldError = (name: string) => (state && !state.ok ? state.fields?.[name] : undefined);

  let statusText = 'I usually reply within a couple of days.';
  let statusClass = 'form-status';
  if (pending) {
    statusText = 'Sending…';
    statusClass += ' is-pending';
  } else if (state?.ok) {
    statusText = "Thanks, your message is in. I'll reply within a couple of days.";
    statusClass += ' is-success';
  } else if (state && !state.ok) {
    statusText = state.error;
    statusClass += ' is-error';
  }

  return (
    <form ref={formRef} action={formAction} className="contact-form" noValidate={false}>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required aria-invalid={!!fieldError('name')} />
          {fieldError('name') && <span className="form-error">{fieldError('name')}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required aria-invalid={!!fieldError('email')} />
          {fieldError('email') && <span className="form-error">{fieldError('email')}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" placeholder="+1 555 555 5555" />
        </div>
        <div className="form-field">
          <label htmlFor="company">Company/Organization</label>
          <input type="text" id="company" name="company" placeholder="Optional" />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="service">What do you need?</label>
          <select id="service" name="service" required defaultValue="">
            <option value="" disabled>
              Select a service
            </option>
            {SERVICE_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {fieldError('service') && <span className="form-error">{fieldError('service')}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="timeline">Timeline</label>
          <select id="timeline" name="timeline" defaultValue="">
            <option value="" disabled>
              Select timeline
            </option>
            <option>ASAP</option>
            <option>2–4 weeks</option>
            <option>1–3 months</option>
            <option>Flexible</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="budget">Budget Range</label>
          <select id="budget" name="budget" defaultValue="">
            <option value="" disabled>
              Select budget
            </option>
            <option>$500–$1,500</option>
            <option>$1,500–$5,000</option>
            <option>$5,000–$10,000</option>
            <option>$10,000+</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" placeholder="City, Country" />
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="message">Project Details</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Tell me about your project, goals, and any references."
          aria-invalid={!!fieldError('message')}
        />
        {fieldError('message') && <span className="form-error">{fieldError('message')}</span>}
      </div>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="form-actions">
        <button type="submit" className="cta-button" disabled={pending}>
          Send Message
        </button>
        <p className={statusClass} role="status" aria-live="polite">
          {statusText}
        </p>
      </div>
    </form>
  );
}
