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
