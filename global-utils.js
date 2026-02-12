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

/**
 * Resizes an image to prevent high-resolution uploads from failing
 * @param {File} file - The original image file
 * @param {number} maxWidth - Max width in pixels
 * @returns {Promise<Blob>} - The resized image blob
 */
async function resizeImage(file, maxWidth = 1024) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = maxWidth / img.width;
                
                // Only resize if the image is actually wider than maxWidth
                if (scale < 1) {
                    canvas.width = maxWidth;
                    canvas.height = img.height * scale;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type, 0.8); // 0.8 quality to keep file size tiny
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}

// Make it globally available just in case
window.resizeImage = resizeImage;
