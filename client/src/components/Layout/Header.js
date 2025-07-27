import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { GiShoppingBag } from 'react-icons/gi'
import { FaShoppingCart, FaSearch, FaUser, FaSignOutAlt, FaTachometerAlt, FaBell, FaHeart } from 'react-icons/fa'
import { useAuth } from '../../context/auth'
import toast from 'react-hot-toast'
import useCategory from '../../hooks/useCategory'
import { useCart } from '../../context/cart'
import SearchInput from '../From/SearchInput'
import '../../styles/Header.css'

const Header = () => {
    const [auth, setAuth] = useAuth();
    const categories = useCategory()
    const [cart] = useCart([]);

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: ""
        })
        localStorage.removeItem('auth');
        toast.success("Logout Successfully")
    }

    // Get total items count
    const getTotalItems = () => {
        return cart.reduce((total, item) => total + (item.quantity || 1), 0);
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!auth?.user?.name) return "U";
        const nameParts = auth.user.name.split(" ");
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return auth.user.name[0].toUpperCase();
    };

    const capitalizeWords = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const name = capitalizeWords(auth?.user?.name);

    return (
        <nav className="navbar navbar-expand-lg custom-navbar">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    <GiShoppingBag className="brand-icon" />
                    <span>ShopEase</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <div className="search-form ms-auto me-auto">
                        <SearchInput />
                    </div>

                    <ul className="navbar-nav mb-2 mb-lg-0 align-items-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home</NavLink>
                        </li>

                        <li className="nav-item dropdown">
                            <Link
                                className="nav-link dropdown-toggle"
                                to="/categories"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Shop
                            </Link>
                            <ul className="dropdown-menu">
                                <li>
                                    <Link className="dropdown-item" to="/categories">All Categories</Link>
                                </li>
                                {categories?.map((c) => (
                                    <li key={c._id}>
                                        <Link className="dropdown-item" to={`/category/${c.slug}`}>{c.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link cart-link" to="/cart">
                                <FaShoppingCart className="cart-icon" />
                                {getTotalItems() > 0 && (
                                    <span className="cart-badge">{getTotalItems()}</span>
                                )}
                            </NavLink>
                        </li>

                        {!auth.user ? (
                            <li className="nav-item ms-2">
                                <NavLink className="btn btn-primary" to="/login">Login / Register</NavLink>
                            </li>
                        ) : (
                            <li className="nav-item dropdown user-dropdown ms-2">
                                <Link
                                    className="nav-link dropdown-toggle"
                                    to="#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <div className="user-avatar">{getUserInitials()}</div>
                                    <span className="d-none d-md-inline">{name}</span>
                                </Link>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to={`/dashboard/${Number(auth?.user?.role) === 1 ? "admin" : "user"}`}
                                        >
                                            <FaTachometerAlt className="me-2" /> Dashboard
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <Link className="dropdown-item" onClick={handleLogout} to="/login">
                                            <FaSignOutAlt className="me-2" /> Logout
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header