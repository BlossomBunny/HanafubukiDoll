function toggleAccessMenu() {
    const menu = document.getElementById('accessMenu');
    menu.classList.toggle('hidden');
}

function updateAccessSetting(className, isEnabled) {
    if (isEnabled) {
        document.body.classList.add(className);
        localStorage.setItem(className, 'enabled');
    } else {
        document.body.classList.remove(className);
        localStorage.setItem(className, 'disabled');
    }
}

function applySavedPreferences() {
    // List of all our accessibility classes
    const settings = [
        { id: 'dark-theme', toggle: 'darkToggle' },
        { id: 'reduced-motion', toggle: 'motionToggle' },
        { id: 'dyslexia-mode', toggle: 'dyslexiaToggle' },
        { id: 'high-contrast', toggle: 'contrastToggle' }
    ];
    
    settings.forEach(setting => {
        const isEnabled = localStorage.getItem(setting.id) === 'enabled';
        if (isEnabled) {
            document.body.classList.add(setting.id);
            // Check the box if it exists on the current page
            const checkbox = document.getElementById(setting.toggle);
            if (checkbox) checkbox.checked = true;
        }
    });
}

// Ensure settings apply immediately on every page load
window.addEventListener('DOMContentLoaded', applySavedPreferences);
