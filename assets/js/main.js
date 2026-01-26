document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    observer.observe(section);
});

document.querySelector('.hero').style.opacity = '1';
document.querySelector('.hero').style.transform = 'translateY(0)';

const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.name.value.trim();
        const email = contactForm.email.value.trim();
        const phone = contactForm.phone.value.trim();
        const company = contactForm.company.value.trim();
        const service = contactForm.service.value;
        const timeline = contactForm.timeline.value;
        const budget = contactForm.budget.value;
        const locationField = contactForm.location.value.trim();
        const message = contactForm.message.value.trim();
        if (!name || !email || !service || !message) {
            contactForm.reportValidity();
            return;
        }
        const subject = `New inquiry: ${service} - ${name}`;
        const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : '',
            company ? `Company: ${company}` : '',
            `Service: ${service}`,
            timeline ? `Timeline: ${timeline}` : '',
            budget ? `Budget: ${budget}` : '',
            locationField ? `Location: ${locationField}` : '',
            '',
            'Details:',
            message,
            '',
            `Page: ${window.location.href}`
        ].filter(Boolean).join('\n');
        const mailto = `mailto:the1qweicue@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines)}`;
        window.location.href = mailto;
    });
}
