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
    document.getElementById('alert-close').onclick = () => document.getElementById('magic-alert').remove();
    
    if (onConfirm) {
        document.getElementById('alert-confirm').onclick = () => {
            onConfirm();
            document.getElementById('magic-alert').remove();
        };
    }
}
