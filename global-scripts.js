
const SUPABASE_URL = 'https://hxqxinfdeyprkuvvyqet.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J6MAvzpyVHd_zo6PtEcnzQ_L6AVEDZE';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// global-scripts.js

// 1. The Universal Auth Guard
document.addEventListener('DOMContentLoaded', () => {
    _supabase.auth.onAuthStateChange((event, session) => {
        const isAdminPage = window.location.pathname.includes('admin-');

        if (session) {
            // Reveal UI elements if they exist on the current page
            document.getElementById('adminNav')?.classList.remove('auth-hidden', 'hidden');
            document.getElementById('adminMain')?.classList.remove('auth-hidden', 'hidden');

            // Page-Specific Initializers (Only runs if the function exists on that page)
            if (typeof renderplanner === 'function' && document.getElementById('calendar')) {
                renderPlanner();
            }
            if (typeof renderdashboard === 'function') renderdashboard();
            if (typeof loadworkbench === 'function') renderworkbench();
            if (typeof renderinventory === 'function') renderinventory();
            if (typeof renderfinancials === 'function') renderfinancials();

        } else if (isAdminPage) {
            // Kick to login ONLY if they are trying to access an admin page
            window.location.href = 'admin-login.html'; 
        }
    });
});

// 2. The Universal Logout (Call this from any "Logout" button)
async function handleLogout() {
    try {
        await _supabase.auth.signOut();
        localStorage.removeItem('hana_active_tab'); // Clean up session data
        window.location.href = 'admin-login.html';
    } catch (err) {
        console.error("Logout error:", err);
    }
}

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
