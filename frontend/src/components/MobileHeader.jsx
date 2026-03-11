import { FiMenu } from 'react-icons/fi';

const MobileHeader = ({ onMenuClick }) => {
    return (
        <header className="mobile-header">
            <div className="mobile-brand">
                <img src="/xyzon-logo.jpeg" alt="Xyzon" className="mobile-logo" />
                <span className="mobile-brand-name">Planora</span>
            </div>
            <button className="menu-toggle" onClick={onMenuClick} aria-label="Open Menu">
                <FiMenu size={24} />
            </button>
        </header>
    );
};

export default MobileHeader;
