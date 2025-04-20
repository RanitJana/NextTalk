import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useChatStore from "../store/useChatStore.js";

import {
  LogOut,
  MessageSquare,
  Settings,
  User,
  Search,
  Menu,
} from "lucide-react";

const Navbar = () => {

  const { getSearchResults, createOneToOneChat } = useChatStore();
  const { logout, authUser } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Mock search function - replace with your actual search API call
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const users = await getSearchResults(searchQuery);

      if (users && users.length > 0) {
        const formatted = users.map((user) => ({
          id: user._id,
          _id: user._id,
          name: user.name,
          profilePic: user.profilePic,
          type: "user",
        }));

        setSearchResults(formatted);

      }
    } catch (error) {
      console.error("Search failed", error);
    }

    // Mock results - replace with your actual search logic
    // const mockResults = [
    //   { id: 1, title: "Conversation about React", type: "chat", preview: "We were discussing React hooks..." },
    //   { id: 2, title: "User: John Doe", type: "user", username: "johndoe" },
    //   { id: 3, title: "Group: Developers", type: "group", members: 24 },
    // ].filter(item =>
    //   item.title.toLowerCase().includes(searchQuery.toLowerCase())
    // );

    // setSearchResults(mockResults.slice(0, 3)); // Limit to 3 results
  };

  // Close mobile menu when route changes
  // useEffect(() => {
  //   setShowMobileMenu(false);
  //   setShowMobileSearch(false);
  //   setSearchResults([

  //   ]);
  // }, [location]);

  const handleResultClick = async (result) => {

    if (result.type === "user") {
      try {
        const chat = await createOneToOneChat(result._id); // Assuming result._id is userId
        if (chat) {
          navigate(`/chat/${chat._id}`);
        }
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    }
    else {

      // Handle navigation based on result type
      switch (result.type) {
        case "chat":
          navigate(`/chat/${result.id}`);
          break;
        case "user":
          navigate(`/profile/${result.username}`);
          break;
        case "group":
          navigate(`/group/${result.id}`);
          break;
        default:
          break;
      }
    }
    setSearchQuery("");
    setSearchResults([]);
  };

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
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search messages, users, groups..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-base-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-base-200/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                      key={result.id}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  searchQuery && handleSearch({ preventDefault: () => { } })
                }
                autoFocus
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />

              {/* Mobile Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 border-t border-base-300 shadow-lg z-50">
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="px-4 py-3 hover:bg-base-200 cursor-pointer transition-colors"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="font-medium">{result.title}</div>
                        {result.preview && (
                          <div className="text-sm text-base-content/70 truncate">
                            {result.preview}
                          </div>
                        )}
                        {result.type === "user" && (
                          <div className="text-sm text-base-content/70">
                            User profile
                          </div>
                        )}
                        {result.type === "group" && (
                          <div className="text-sm text-base-content/70">
                            {result.members} members
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
