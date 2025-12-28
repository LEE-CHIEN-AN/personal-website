export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form)
        return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const subject = document.getElementById('subject')?.value || '';
        const message = document.getElementById('message')?.value || '';
        const mailto = `mailto:b12705041@ntu.edu.tw?subject=${encodeURIComponent('[網站聯絡] ' + subject)}&body=${encodeURIComponent(`姓名：${name}\nEmail：${email}\n\n訊息：\n${message}`)}`;
        window.location.href = mailto;
    });
}
