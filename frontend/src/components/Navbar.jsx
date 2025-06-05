import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import useLogout from "../hooks/useLogout";
import ThemeSelector from "./ThemeSelector";

const Navbar = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const navigate = useNavigate();
    const isChatPage = location.pathname?.startsWith("/chat");
    const { logoutMutation } = useLogout();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProfileClick = () => {
        navigate("/profile");
        setDropdownOpen(false);
    };

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full">
                    {isChatPage && (
                        <div className="pl-5">
                            <Link to="/" className="flex items-center gap-2.5">
                                <ShipWheelIcon className="size-9 text-primary" />
                                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
                                    Streamify
                                </span>
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        <Link to={"/notifications"}>
                            <button className="btn btn-ghost btn-circle">
                                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                            </button>
                        </Link>
                    </div>

                    <ThemeSelector />

                    {/* Avatar Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <div
                            className="avatar cursor-pointer"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                        >
                            <div className="w-9 rounded-full">
                                <img
                                    src={authUser?.profilePic}
                                    alt="User Avatar"
                                    rel="noreferrer"
                                />
                            </div>
                        </div>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-black border border-gray-800 rounded-md shadow-md z-50">
                                <button
                                    onClick={handleProfileClick}
                                    className="block w-full text-left px-4 py-2 text-sm text-white hover:text-primary hover:bg-black transition-colors duration-200"
                                >
                                    My Profile
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Logout button */}
                    <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                        <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
