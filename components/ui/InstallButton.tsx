import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './Button';

export const InstallButton: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5">
            <Button
                variant="primary"
                onClick={handleInstallClick}
                className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl flex items-center gap-2 px-6 py-4 rounded-full font-bold animate-pulse"
            >
                <Download size={20} />
                INSTALAR APP
            </Button>
        </div>
    );
};
