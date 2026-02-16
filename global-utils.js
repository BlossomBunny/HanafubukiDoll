/**
 * showMagicAlert
 * @param {string} title - The big text
 * @param {string} message - The subtext
 * @param {string} type - 'success', 'error', or 'confirm'
 * @param {function} onConfirm - Function to run if user clicks "Yes" (for confirm type)
 */
function showMagicAlert(title, message, type = 'success', onConfirm = null) {
    // Remove existing modal if any
    const existing = document.getElementById('magic-alert');
    if (existing) existing.remove();

    const icons = {
        success: '🌸',
        error: '☁️',
        confirm: '🎀'
    };

    const modalHtml = `
    <div id="magic-alert" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <div class="absolute inset-0 bg-pink-100/40 backdrop-blur-sm"></div>
        <div class="relative bg-white p-8 rounded-[35px] shadow-2xl border-4 border-white max-w-sm w-full text-center animate-pop ${type === 'error' ? 'error-shake' : ''}">
            <div class="text-5xl mb-4">${icons[type]}</div>
            <h2 class="text-2xl font-black tracking-tighter text-gray-800">${title}</h2>
            <p class="text-gray-500 text-xs mt-3 leading-relaxed">${message}</p>
            
            <div class="mt-6 flex flex-col gap-2">
                ${type === 'confirm' ? `
                    <button id="alert-confirm" class="w-full bg-pink-500 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Yes, Proceed ♡</button>
                    <button id="alert-close" class="w-full bg-gray-100 text-gray-400 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Cancel</button>
                ` : `
                    <button id="alert-close" class="w-full bg-pink-500 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Wonderful ✨</button>
                `}
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Event Listeners
const closeBtn = document.getElementById('alert-close');
    if (closeBtn) {
        closeBtn.onclick = () => document.getElementById('magic-alert').remove();
    }
    
 
    const confirmBtn = document.getElementById('alert-confirm');
    if (onConfirm && confirmBtn) {
        confirmBtn.onclick = () => {
            onConfirm();
            document.getElementById('magic-alert').remove();
        };
    }
}

async function resizeImage(file, maxWidth = 1024, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = maxWidth / img.width;
                
                if (scale < 1) {
                    canvas.width = maxWidth;
                    canvas.height = img.height * scale;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                const ctx = canvas.getContext('2d');
                // Improve scaling quality
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob((blob) => {
                    // Create a new File object from the blob to preserve the original filename
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    resolve(resizedFile);
                }, file.type, quality); 
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

/**
 * Studio Global Loader Manager
 * Handles the "Whisking your request away..." overlay
 */
const StudioLoader = {
    // Injects the loader HTML into the page automatically
    init() {
        if (document.getElementById('loadingOverlay')) return;
        const loaderHTML = `
            <div id="loadingOverlay" class="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white/60 backdrop-blur-md hidden opacity-0 transition-opacity duration-300">
                <div class="relative">
                    <div class="w-20 h-20 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                </div>
                <p class="mt-4 font-black text-[10px] uppercase tracking-[0.2em] text-pink-500 animate-pulse">Whisking your request away...</p>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', loaderHTML);
    },

    show() {
        const el = document.getElementById('loadingOverlay');
        if (!el) return;
        el.classList.remove('hidden');
        // Force a tiny reflow for the opacity transition
        void el.offsetWidth;
        el.classList.add('opacity-100');
    },

    hide() {
        const el = document.getElementById('loadingOverlay');
        if (!el) return;
        el.classList.remove('opacity-100');
        setTimeout(() => el.classList.add('hidden'), 300);
    }
};

// --- THE FETCH INTERCEPTOR (Auto-Loader) ---
// This automatically shows the loader whenever Supabase or an image upload is working
(function() {
    const originalFetch = window.fetch;
    let activeRequests = 0;

    window.fetch = async (...args) => {
        activeRequests++;
        StudioLoader.show();

        try {
            const response = await originalFetch(...args);
            return response;
        } catch (error) {
            throw error;
        } finally {
            activeRequests--;
            if (activeRequests <= 0) {
                activeRequests = 0;
                StudioLoader.hide();
            }
        }
    };
})();

// Initialize loader on every page load
document.addEventListener('DOMContentLoaded', () => StudioLoader.init());
