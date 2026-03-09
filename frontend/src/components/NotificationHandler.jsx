import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getNotifications, markNotificationsRead } from '../api';
import { useAuth } from '../context/AuthContext';
import { FiBell } from 'react-icons/fi';

const NotificationHandler = () => {
    const { user } = useAuth();
    const seenIds = useRef(new Set());
    const isFirstRun = useRef(true);

    const fetchAndShow = async () => {
        if (!user) return;
        try {
            const { data: notifications } = await getNotifications();

            // Only show unread ones that we haven't toasted in this session
            const unread = notifications.filter(n => !n.isRead && !seenIds.current.has(n.id));

            if (unread.length > 0) {
                unread.forEach(n => {
                    // Avoid showing old notifications as "new" toasts on the very first load
                    if (!isFirstRun.current) {
                        toast(n.message, {
                            icon: <FiBell color="var(--primary)" />,
                            duration: 6000,
                            style: {
                                background: 'var(--card-bg)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border)',
                                fontSize: '0.9rem',
                                padding: '12px 16px',
                                borderRadius: '12px'
                            }
                        });
                    }
                    seenIds.current.add(n.id);
                });
            }
            isFirstRun.current = false;
        } catch (error) {
            console.error('Notification fetch failed:', error);
        }
    };

    useEffect(() => {
        if (!user) return;

        // Initial fetch
        fetchAndShow();

        // Poll every 30 seconds
        const interval = setInterval(fetchAndShow, 30000);

        return () => clearInterval(interval);
    }, [user]);

    return null; // This component has no UI, it only manages toasts
};

export default NotificationHandler;
