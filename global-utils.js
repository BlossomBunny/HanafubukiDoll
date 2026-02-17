const StudioLoader = {
    init() {
        if (document.getElementById('loadingOverlay')) return;

        const html = `
            <div id="loadingOverlay" class="fixed inset-0 bg-white/80 backdrop-blur-md z-[10000] flex flex-col items-center justify-center hidden opacity-0 transition-opacity duration-300 pointer-events-none">
                <div class="relative">
                    <div class="w-16 h-16 border-4 border-pink-100 border-t-emerald-400 rounded-full animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center text-xl animate-pulse">🌸</div>
                </div>
                <p id="loadingText" class="mt-6 font-black uppercase tracking-[0.3em] text-[10px] text-pink-400">Processing...</p>
            </div>`;

        document.body.insertAdjacentHTML('beforeend', html);
    },

    show(text = "Pounding mochi... please wait! ✨") {
        this.init();
        const el = document.getElementById('loadingOverlay');
        const txt = document.getElementById('loadingText');

        if (txt) txt.textContent = text;
        if (el) {
            el.classList.remove('hidden', 'pointer-events-none');
            // Force reflow for smooth transition
            void el.offsetWidth;
            el.classList.add('opacity-100');
        }
    },

    hide() {
        const el = document.getElementById('loadingOverlay');
        if (!el) return;

        el.classList.remove('opacity-100');
        el.classList.add('pointer-events-none');

        // Wait for fade-out transition before hiding
        setTimeout(() => {
            el.classList.add('hidden');
        }, 320);
    }
};
// --- MAGIC ALERT FUNCTION ---
function showMagicAlert(title, message, type = 'success', onConfirm = null) {
    const existing = document.getElementById('magic-alert');
    if (existing) existing.remove();

    const icons = { success: '🌸', error: '☁️', confirm: '🎀' };

    const modalHtml = `
    <div id="magic-alert" class="fixed inset-0 z-[10010] flex items-center justify-center p-6">
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
                    <button id="alert-close" class="w-full bg-pink-500 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">Okay! ✨</button>
                `}
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('alert-close').onclick = () => document.getElementById('magic-alert').remove();
    const confirmBtn = document.getElementById('alert-confirm');
    if (onConfirm && confirmBtn) {
        confirmBtn.onclick = () => {
            onConfirm();
            document.getElementById('magic-alert').remove();
        };
    }
}

// --- IMAGE RESIZER ---
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
                canvas.width = scale < 1 ? maxWidth : img.width;
                canvas.height = scale < 1 ? img.height * scale : img.height;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, { type: file.type, lastModified: Date.now() }));
                }, file.type, quality); 
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}
