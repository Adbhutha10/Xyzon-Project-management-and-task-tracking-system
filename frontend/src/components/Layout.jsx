import Sidebar from './Sidebar';
import PageTransition from './PageTransition';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="main-content">
                <PageTransition>
                    {children}
                </PageTransition>
            </main>
        </div>
    );
};

export default Layout;
