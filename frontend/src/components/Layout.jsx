import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import PageTransition from './PageTransition';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="layout">
            <MobileHeader onMenuClick={toggleSidebar} />

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div className="sidebar-backdrop" onClick={closeSidebar}></div>
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            <main className="main-content">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
        </div>
    );
};

export default Layout;
