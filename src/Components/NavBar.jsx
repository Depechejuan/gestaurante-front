import { useState } from "react"

import menuIcon from "../assets/Icons/menu.svg";

import "../styles/Customer/main.css"
import "../styles/Staff/main.css"

import Menu from "./Customer-Menu.jsx";
import StaffMenu from "./Staff-Menu.jsx";


export default function NavBar({input}) {
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
                className={`${input === "staff" ? "menu-icon-staff" : "menu-icon-customer"}`}
                onClick={handleMenuClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleMenuClick();
                    }
                }}
            />
            {input == "customer" &&
                <Menu 
                    isMenuOpen={isMenuOpen} 
                    closeMenu={closeMenu} 
            />}
            {input == "staff" && 
                <StaffMenu
                    isMenuOpen={isMenuOpen} 
                    closeMenu={closeMenu}
            />}
        </>
    );
}
