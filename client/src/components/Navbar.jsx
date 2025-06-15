import React, { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useChatStore from "../store/useChatStore.js";
import { debounce } from 'lodash';
import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Search,
  Menu,
} from "lucide-react";
import { useChatContext } from "../context/ChatProvider.jsx";
import { getChatName, getProfilePic } from "../utils/chat.js";

const Navbar = () => {
  const { getSearchResults, createOneToOneChat } = useChatStore();
  const { logout, authUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    setChats,
    selectedChat,
    setSelectedChat,
    setPicInfo,
    setChatName,
  } = useChatContext();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (query.trim() === "") {
        setSearchResults([]);
        return;
      }
      try {
        const response = await getSearchResults(query);
        setSearchResults(response.users);
      } catch (error) {
        console.error("Search failed", error);
      }
    }, 500),
    []
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    await debouncedSearch(searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleResultClick = async (result) => {
    let res = await createOneToOneChat(result._id);
    setChats((prev) => [res.chat, ...prev]);
    setSelectedChat(res.chat);
    setChatName(getChatName(res.chat, user._id));
    setPicInfo(getProfilePic(res.chat, user._id));
    setShowMobileSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <header className="bg-base-100 border-b border-base-300 w-full top-0 z-40 bg-base-100/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-base-200 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold hidden sm:block">NextTalk</h1>
            </Link>
          </div>

          {/* Desktop Search Bar with Results */}
          {authUser && (
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <form onSubmit={handleSearch} className="w-full relative">
                <input
                  type="text"
                  placeholder="Search messages, users, groups..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-base-200/50"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() =>
                    searchQuery && handleSearch({ preventDefault: () => { } })
                  }
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-base-100 shadow-lg z-50 rounded-md mt-1 max-h-64 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result._id}
                        className="px-4 py-2 hover:bg-base-200 cursor-pointer transition-colors flex items-center gap-3"
                        onClick={() => handleResultClick(result)}
                      >
                        <img
                          src={result.profilePic}
                          alt={result.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="text-sm">{result.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </div>
          )}

          {/* Mobile Search Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              className="p-2 rounded-full hover:bg-base-200 transition-colors"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/settings" className="btn btn-sm gap-2 transition-colors">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            {authUser && (
              <>
                <Link to="/profile" className="btn btn-sm gap-2">
                  <User className="size-5" />
                  <span>Profile</span>
                </Link>
                <button className="btn btn-sm gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar with Results */}
        {showMobileSearch && (
          <div className="md:hidden bg-base-100 relative">
            <form onSubmit={handleSearch} className="w-full relative px-2 py-2">
              <input
                type="text"
                placeholder="Search messages, users, groups..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-base-200/50"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() =>
                  searchQuery && handleSearch({ preventDefault: () => { } })
                }
                autoFocus
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />

              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-base-100 shadow-lg z-50 rounded-md mt-1 max-h-64 overflow-y-auto">
                  {searchResults.map((result) => (
                    <div
                      key={result._id}
                      className="px-4 py-2 hover:bg-base-200 cursor-pointer transition-colors flex items-center gap-3"
                      onClick={() => handleResultClick(result)}
                    >
                      <img
                        src={result.profilePic}
                        alt={result.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="text-sm">{result.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden bg-base-100 border-t border-base-300 py-2 px-4 space-y-2">
            <Link
              to="/settings"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
                <button
                  className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-base-200 transition-colors text-left"
                  onClick={logout}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;