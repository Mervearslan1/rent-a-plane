import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="brand">
                    <span className="brand-icon">✈</span>
                    <span>Rent a Plane</span>
                </Link>

                <nav className="nav-links">
                    <NavLink to="/">Uçakları Keşfet</NavLink>
                    <a href="#about">Hakkımızda</a>
                </nav>
            </div>
        </header>
    );
}