import { highlightActiveNav } from './nav.js';
import { initTimeline } from './timeline.js';
import { initContactForm } from './contact.js';
function init() {
    highlightActiveNav();
    const isTimeline = document.getElementById('timeline-events') !== null;
    if (isTimeline) {
        initTimeline().catch((error) => {
            console.error('初始化 timeline 時發生錯誤:', error);
        });
    }
    const hasContactForm = document.getElementById('contact-form') !== null;
    if (hasContactForm) {
        initContactForm();
    }
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
}
else {
    init();
}
