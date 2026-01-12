import menuIcon from "../assets/Icons/menu.svg"
import { useState } from "react"
import Menu from "./Customer-Menu.jsx";

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }


    return (
        <>
            <input
                type="image"
                src={menuIcon}
                alt="Menu"
                className="menu-icon"
                onClick={handleMenuClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleMenuClick();
                    }
                }}
            />
            
            <Menu 
                isMenuOpen={isMenuOpen} 
                closeMenu={closeMenu} 
            />
        </>
    );
}
