
const SUPABASE_URL = 'https://hxqxinfdeyprkuvvyqet.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J6MAvzpyVHd_zo6PtEcnzQ_L6AVEDZE';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Auth listener - Protects ONLY admin pages
_supabase.auth.onAuthStateChange((event, session) => {
    // Check if the current page filename starts with "admin-"
    const isAdminPage = window.location.pathname.includes('admin-');

    if (!session) {
        // If there is no session AND they are on an admin page, redirect them
        if (isAdminPage) {
            console.log("Access denied: Admin session required.");
            window.location.href = 'admin-login.html'; 
        }
        // If they are on a customer page and NOT logged in, we do nothing! 
        // This stops the "random" redirects.
    } else {
        // If they ARE logged in (Admin is active)
        // Handle global UI reveals
        document.getElementById('adminNav')?.classList.remove('auth-hidden');
        document.getElementById('adminMain')?.classList.remove('auth-hidden');
        
        // Custom page logic: If the page has an 'initPage' function, run it
        if (typeof initPage === 'function') {
            initPage(session);
        }
    }
});

/* --- Hanafubuki Studio Global Accessibility Script --- */

const ComfortSettings = {
    settings: [
        { id: 'dark-theme', toggle: 'darkToggle' },
        { id: 'reduced-motion', toggle: 'motionToggle' },
        { id: 'dyslexia-mode', toggle: 'dyslexiaToggle' }
    ],

    init() {
        this.applySaved();
        
        document.addEventListener('DOMContentLoaded', () => {
            this.syncUI();
            
            window.addEventListener('click', (e) => {
                const menu = document.getElementById('accessMenu');
                const btn = document.querySelector('.access-btn');
                if (menu && !menu.classList.contains('hidden') && !menu.contains(e.target) && !btn.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            });
        });
    },

    toggleMenu() {
        const menu = document.getElementById('accessMenu');
        if (menu) {
            menu.classList.toggle('hidden');
        } else {
            console.error("Accessibility Menu element not found!");
        }
    },

    update(className, isEnabled) {
        if (isEnabled) {
            document.body.classList.add(className);
            localStorage.setItem(className, 'enabled');
        } else {
            document.body.classList.remove(className);
            localStorage.setItem(className, 'disabled');
        }
    },

    applySaved() {
        this.settings.forEach(s => {
            if (localStorage.getItem(s.id) === 'enabled') {
                document.body.classList.add(s.id);
            }
        });
    },

    syncUI() {
        this.settings.forEach(s => {
            const checkbox = document.getElementById(s.toggle);
            if (checkbox) {
                checkbox.checked = (localStorage.getItem(s.id) === 'enabled');
            }
        });
    }
};

// Initialize the object
ComfortSettings.init();
