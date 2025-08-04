import "./App.css";

import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  MapPin,
  Plus,
  User,
  Settings,
  Eye,
  EyeOff,
  Calendar,
  Store,
  Users,
  Filter,
  X,
  Menu,
  LogOut,
  Lock,
  Globe,
  Share2,
  Zap,
  Coffee,
  Heart,
  Briefcase,
  Music,
  Camera,
} from "lucide-react";

// User Context for SSO simulation
const UserContext = createContext();

// Mock central auth system
const centralAuth = {
  users: [
    {
      id: 1,
      email: "admin@layers.com",
      name: "Admin User",
      reputation: 95,
      postsCount: 23,
      layersCount: 8,
      role: "admin",
      joinedApps: ["spotstitch", "coquest"],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin+User",
    },
    {
      id: 2,
      email: "john@spotstitch.com",
      name: "John Doe",
      reputation: 78,
      postsCount: 45,
      layersCount: 12,
      role: "user",
      joinedApps: ["spotstitch"],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John+Doe",
    },
    {
      id: 3,
      email: "sarah@coquest.coop",
      name: "Sarah Cooper",
      reputation: 89,
      postsCount: 34,
      layersCount: 6,
      role: "moderator",
      joinedApps: ["coquest"],
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah+Cooper",
    },
  ],

  async authenticate(email) {
    // Simulate central auth lookup
    console.log(`Authenticating user: ${email}`);
    await new Promise((resolve) => setTimeout(resolve, 800));

    let user = this.users.find((u) => u.email === email);
    if (!user) {
      // Create new user in central system
      user = {
        id: Date.now(),
        email,
        name: email
          .split("@")[0]
          .replace(/[^a-zA-Z ]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        reputation: 0,
        postsCount: 0,
        layersCount: 0,
        role: "user",
        joinedApps: ["spotstitch", "coquest"], // New users get both by default
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      this.users.push(user);
    }

    return user;
  },
};

// Enhanced mock API with better visibility logic
const mockAPI = {
  layers: [
    // Spotstitch-specific layer types
    {
      id: 1,
      title: "Downtown Toronto Events",
      description: "Cultural events and festivals in the heart of Toronto",
      type: "spotstitch-events", // App-specific type
      location: [43.6532, -79.3832],
      visibleIn: ["spotstitch"],
      visibility: "public", // Anyone on Spotstitch can see
      createdBy: "admin@layers.com",
      createdAt: "2025-01-15",
      posts: 23,
      followers: 156,
    },
    {
      id: 2,
      title: "Kensington Market Vendors",
      description: "Local vendors and artisans in Kensington Market",
      type: "spotstitch-commerce",
      location: [43.6547, -79.4011],
      visibleIn: ["spotstitch", "coquest"], // Shared between apps
      visibility: "shared", // Visible to both apps but managed centrally
      createdBy: "vendor@market.com",
      createdAt: "2025-01-10",
      posts: 45,
      followers: 289,
    },
    {
      id: 3,
      title: "Etobicoke Community Garden",
      description: "Collaborative gardening projects and workshops",
      type: "coquest-projects", // CoQuest-specific type
      location: [43.6205, -79.5132],
      visibleIn: ["coquest"],
      visibility: "private", // Only visible to garden members
      createdBy: "gardener@coop.com",
      createdAt: "2025-01-12",
      posts: 12,
      followers: 34,
    },
    {
      id: 4,
      title: "Distillery District Art Walk",
      description: "Monthly art installations and gallery openings",
      type: "spotstitch-lifestyle",
      location: [43.6503, -79.3599],
      visibleIn: ["spotstitch"],
      visibility: "public",
      createdBy: "artist@district.com",
      createdAt: "2025-01-20",
      posts: 67,
      followers: 234,
    },
    {
      id: 5,
      title: "Queen West Food Trucks",
      description: "Rotating food truck locations and schedules",
      type: "spotstitch-food",
      location: [43.6476, -79.4],
      visibleIn: ["spotstitch", "coquest"],
      visibility: "shared",
      createdBy: "foodie@queen.com",
      createdAt: "2025-01-18",
      posts: 89,
      followers: 412,
    },
    {
      id: 6,
      title: "Scarborough Co-op Housing",
      description: "Cooperative housing initiatives and community meetings",
      type: "coquest-housing",
      location: [43.7315, -79.2663],
      visibleIn: ["coquest"],
      visibility: "shared", // Shared among co-op members
      createdBy: "housing@coop.com",
      createdAt: "2025-01-05",
      posts: 156,
      followers: 89,
    },
    {
      id: 7,
      title: "Liberty Village Tech Meetups",
      description: "Weekly tech networking and startup events",
      type: "spotstitch-networking",
      location: [43.6393, -79.4196],
      visibleIn: ["spotstitch", "coquest"],
      visibility: "public",
      createdBy: "tech@liberty.com",
      createdAt: "2025-01-22",
      posts: 34,
      followers: 567,
    },
    {
      id: 8,
      title: "High Park Fitness Groups",
      description: "Outdoor fitness classes and running clubs",
      type: "spotstitch-fitness",
      location: [43.6465, -79.4637],
      visibleIn: ["spotstitch"],
      visibility: "public",
      createdBy: "fitness@park.com",
      createdAt: "2025-01-14",
      posts: 78,
      followers: 234,
    },
    {
      id: 9,
      title: "Junction Triangle Makers",
      description: "Maker spaces and DIY workshops",
      type: "coquest-workspace",
      location: [43.6719, -79.4454],
      visibleIn: ["coquest"],
      visibility: "shared",
      createdBy: "maker@junction.com",
      createdAt: "2025-01-08",
      posts: 23,
      followers: 67,
    },
    {
      id: 10,
      title: "Riverside Farmers Market",
      description: "Weekend farmers market with local produce",
      type: "spotstitch-market",
      location: [43.6594, -79.3535],
      visibleIn: ["spotstitch", "coquest"],
      visibility: "public",
      createdBy: "farmers@riverside.com",
      createdAt: "2025-01-25",
      posts: 45,
      followers: 189,
    },
    {
      id: 11,
      title: "Parkdale Community Kitchen",
      description: "Shared cooking spaces and food security initiatives",
      type: "coquest-community",
      location: [43.6383, -79.4375],
      visibleIn: ["coquest"],
      visibility: "private", // Only for registered members
      createdBy: "kitchen@parkdale.com",
      createdAt: "2025-01-16",
      posts: 67,
      followers: 45,
    },
    {
      id: 12,
      title: "Harbourfront Summer Festival",
      description: "Seasonal outdoor concerts and performances",
      type: "spotstitch-music",
      location: [43.6387, -79.3816],
      visibleIn: ["spotstitch"],
      visibility: "public",
      createdBy: "events@harbourfront.com",
      createdAt: "2025-01-30",
      posts: 123,
      followers: 789,
    },
    // Additional layers with new types
    {
      id: 13,
      title: "Bloor West Photography Walks",
      description: "Weekly photography meetups and workshops",
      type: "spotstitch-photography",
      location: [43.6505, -79.4456],
      visibleIn: ["spotstitch"],
      visibility: "public",
      createdBy: "photo@bloor.com",
      createdAt: "2025-01-28",
      posts: 34,
      followers: 123,
    },
    {
      id: 14,
      title: "Cooperative Business Network",
      description: "Supporting local cooperative businesses",
      type: "coquest-business",
      location: [43.6532, -79.3968],
      visibleIn: ["coquest"],
      visibility: "shared",
      createdBy: "coop@business.com",
      createdAt: "2025-01-12",
      posts: 89,
      followers: 156,
    },
  ],

  async getLayers(app = null, type = null, user = null) {
    let filteredLayers = [...this.layers];

    if (app) {
      filteredLayers = filteredLayers.filter((layer) => {
        // Check if layer is visible in the current app
        if (!layer.visibleIn.includes(app)) return false;

        // Apply visibility logic based on user permissions
        if (layer.visibility === "private") {
          // Private layers only visible to creator and members
          return (
            user &&
            layer.visibleIn.some((app) => user.joinedApps.includes(app)) &&
            (layer.createdBy === user.email || user.role === "admin")
          );
        } else if (layer.visibility === "shared") {
          // Shared layers visible to users of both apps if they have access
          return (
            user &&
            user.joinedApps.some((userApp) => layer.visibleIn.includes(userApp))
          );
        } else {
          // Public layers visible to everyone in the app
          return true;
        }
      });
    }

    if (type && type !== "all") {
      filteredLayers = filteredLayers.filter((layer) => layer.type === type);
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(filteredLayers), 100);
    });
  },

  async createLayer(layerData, user) {
    const newLayer = {
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: user.email,
      posts: 0,
      followers: 1, // Creator follows their own layer
      ...layerData,
    };
    this.layers.push(newLayer);
    return new Promise((resolve) => {
      setTimeout(() => resolve(newLayer), 100);
    });
  },

  async getLayerDetails(layerId) {
    const layer = this.layers.find((l) => l.id === layerId);
    if (!layer) throw new Error("Layer not found");

    // Simulate additional details
    return {
      ...layer,
      recentPosts: [
        { id: 1, author: "John D.", content: "Great event last weekend!" },
        {
          id: 2,
          author: "Sarah M.",
          content: "Looking forward to the next one",
        },
        { id: 3, author: "Mike R.", content: "Thanks for organizing this" },
      ],
      upcomingEvents: layer.type.includes("events")
        ? [
            { date: "2025-02-15", title: "Weekend Workshop" },
            { date: "2025-02-22", title: "Community Gathering" },
          ]
        : [],
    };
  },
};

// Leaflet Map Component
const LeafletMap = ({ layers, onLayerClick, currentApp }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize Leaflet map
    const L = window.L;
    if (!L) {
      // Load Leaflet dynamically
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    } else {
      initMap();
    }

    function initMap() {
      const L = window.L;

      // 👇 Safely reset any previous map instance
      if (mapRef.current && mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }

      const newMap = L.map(mapRef.current).setView([43.6532, -79.3832], 11);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(newMap);
      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!map || !window.L) return;

    const L = window.L;

    // Clear existing markers
    markers.forEach((marker) => map.removeLayer(marker));

    // Add new markers
    const newMarkers = layers.map((layer) => {
      const getMarkerColor = (type) => {
        // App-specific colors
        if (type.startsWith("spotstitch-")) {
          switch (type) {
            case "spotstitch-events":
              return "#10b981"; // green
            case "spotstitch-commerce":
              return "#3b82f6"; // blue
            case "spotstitch-lifestyle":
              return "#f59e0b"; // amber
            case "spotstitch-food":
              return "#ef4444"; // red
            case "spotstitch-networking":
              return "#8b5cf6"; // violet
            case "spotstitch-fitness":
              return "#06b6d4"; // cyan
            case "spotstitch-market":
              return "#84cc16"; // lime
            case "spotstitch-music":
              return "#ec4899"; // pink
            case "spotstitch-photography":
              return "#6366f1"; // indigo
            default:
              return "#6b7280"; // gray
          }
        } else if (type.startsWith("coquest-")) {
          switch (type) {
            case "coquest-projects":
              return "#059669"; // emerald
            case "coquest-housing":
              return "#dc2626"; // red
            case "coquest-workspace":
              return "#7c3aed"; // purple
            case "coquest-community":
              return "#ea580c"; // orange
            case "coquest-business":
              return "#0891b2"; // sky
            default:
              return "#374151"; // gray
          }
        }
        return "#6b7280";
      };

      const getVisibilityIcon = (visibility) => {
        switch (visibility) {
          case "public":
            return "🌍";
          case "shared":
            return "🤝";
          case "private":
            return "🔒";
          default:
            return "📍";
        }
      };

      const color = getMarkerColor(layer.type);
      const visibilityIcon = getVisibilityIcon(layer.visibility);

      // Create custom icon
      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(-45deg);
            cursor: pointer;
          ">
            <span style="transform: rotate(45deg); font-size: 12px;">${visibilityIcon}</span>
          </div>
        `,
        className: "custom-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker([layer.location[0], layer.location[1]], {
        icon: customIcon,
      }).addTo(map);

      marker.bindPopup(`
        <div class="p-2">
          <h3 class="font-bold text-lg">${layer.title}</h3>
          <p class="text-sm text-gray-600 mb-2">${layer.description}</p>
          <div class="flex justify-between items-center text-xs">
            <span class="bg-gray-100 px-2 py-1 rounded">${layer.type}</span>
            <span class="text-gray-500">${layer.posts} posts</span>
          </div>
        </div>
      `);

      marker.on("click", () => {
        onLayerClick(layer);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, layers, onLayerClick]);

  return <div ref={mapRef} className="w-full h-full rounded-xl" />;
};

// Layer Details Modal
const LayerDetailsModal = ({ layer, isOpen, onClose, currentApp }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && layer) {
      setLoading(true);
      mockAPI.getLayerDetails(layer.id).then((data) => {
        setDetails(data);
        setLoading(false);
      });
    }
  }, [isOpen, layer]);

  if (!isOpen || !layer) return null;

  const getTypeIcon = (type) => {
    if (type.includes("events")) return <Calendar className="w-5 h-5" />;
    if (type.includes("commerce") || type.includes("market"))
      return <Store className="w-5 h-5" />;
    if (type.includes("social") || type.includes("community"))
      return <Users className="w-5 h-5" />;
    if (type.includes("food")) return <Coffee className="w-5 h-5" />;
    if (type.includes("fitness")) return <Heart className="w-5 h-5" />;
    if (type.includes("business")) return <Briefcase className="w-5 h-5" />;
    if (type.includes("music")) return <Music className="w-5 h-5" />;
    if (type.includes("photography")) return <Camera className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  const getVisibilityInfo = (visibility) => {
    switch (visibility) {
      case "public":
        return {
          icon: <Globe className="w-4 h-4" />,
          text: "Public - Anyone can see",
          color: "text-green-600",
        };
      case "shared":
        return {
          icon: <Share2 className="w-4 h-4" />,
          text: "Shared - Available across apps",
          color: "text-blue-600",
        };
      case "private":
        return {
          icon: <Lock className="w-4 h-4" />,
          text: "Private - Members only",
          color: "text-red-600",
        };
      default:
        return {
          icon: <Eye className="w-4 h-4" />,
          text: "Unknown",
          color: "text-gray-600",
        };
    }
  };

  const visibilityInfo = getVisibilityInfo(layer.visibility);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              {getTypeIcon(layer.type)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {layer.title}
              </h2>
              <div
                className={`flex items-center space-x-1 text-sm ${visibilityInfo.color}`}
              >
                {visibilityInfo.icon}
                <span>{visibilityInfo.text}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading details...</p>
          </div>
        ) : details ? (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-600">{details.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {details.posts}
                </div>
                <div className="text-sm text-gray-500">Posts</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {details.followers}
                </div>
                <div className="text-sm text-gray-500">Followers</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-bold text-purple-600">
                  {details.type}
                </div>
                <div className="text-sm text-gray-500">Category</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-bold text-orange-600">
                  {details.createdAt}
                </div>
                <div className="text-sm text-gray-500">Created</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {details.recentPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-900">
                      {post.author}
                    </div>
                    <div className="text-gray-600 text-sm">{post.content}</div>
                  </div>
                ))}
              </div>
            </div>

            {details.upcomingEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Upcoming Events
                </h3>
                <div className="space-y-2">
                  {details.upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                    >
                      <span className="font-medium text-blue-900">
                        {event.title}
                      </span>
                      <span className="text-blue-600 text-sm">
                        {event.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visibility Settings
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Available in:</span>
                  <div className="flex space-x-2">
                    {details.visibleIn.map((app) => (
                      <span
                        key={app}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          app === "spotstitch"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {app === "spotstitch" ? "Spotstitch" : "CoQuest"}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {layer.visibility === "public" &&
                    "This layer is visible to all users of the selected apps."}
                  {layer.visibility === "shared" &&
                    "This layer is shared between apps but may have restricted access."}
                  {layer.visibility === "private" &&
                    "This layer is only visible to members and the creator."}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Enhanced Create Layer Modal with app-specific types
const CreateLayerModal = ({ isOpen, onClose, onSubmit, currentApp }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type:
      currentApp === "spotstitch" ? "spotstitch-events" : "coquest-projects",
    visibility: "public",
    visibleIn: [currentApp],
    location: [43.6532, -79.3832],
  });

  const getAppSpecificTypes = (app) => {
    if (app === "spotstitch") {
      return [
        { value: "spotstitch-events", label: "Events & Festivals" },
        { value: "spotstitch-commerce", label: "Commerce & Shopping" },
        { value: "spotstitch-lifestyle", label: "Lifestyle & Culture" },
        { value: "spotstitch-food", label: "Food & Dining" },
        { value: "spotstitch-networking", label: "Networking & Professional" },
        { value: "spotstitch-fitness", label: "Fitness & Wellness" },
        { value: "spotstitch-market", label: "Markets & Local Vendors" },
        { value: "spotstitch-music", label: "Music & Entertainment" },
        { value: "spotstitch-photography", label: "Photography & Arts" },
      ];
    } else {
      return [
        { value: "coquest-projects", label: "Community Projects" },
        { value: "coquest-housing", label: "Housing Initiatives" },
        { value: "coquest-workspace", label: "Shared Workspaces" },
        { value: "coquest-community", label: "Community Services" },
        { value: "coquest-business", label: "Cooperative Business" },
      ];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      type:
        currentApp === "spotstitch" ? "spotstitch-events" : "coquest-projects",
      visibility: "public",
      visibleIn: [currentApp],
      location: [43.6532, -79.3832],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Create New Layer</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layer Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="e.g., Downtown Events"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24 resize-none"
              placeholder="Describe what this layer contains..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {getAppSpecificTypes(currentApp).map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility Level
            </label>
            <select
              value={formData.visibility}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, visibility: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="public">Public - Anyone in the app can see</option>
              <option value="shared">
                Shared - Available across selected apps
              </option>
              <option value="private">Private - Only members can see</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.visibility === "public" &&
                "Layer will be visible to all users of the selected apps"}
              {formData.visibility === "shared" &&
                "Layer will be managed centrally and shared between apps based on user permissions"}
              {formData.visibility === "private" &&
                "Only you and invited members will be able to see this layer"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available In Apps
            </label>
            <div className="space-y-2">
              {user.joinedApps.includes("spotstitch") && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.visibleIn.includes("spotstitch")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          visibleIn: [...prev.visibleIn, "spotstitch"],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          visibleIn: prev.visibleIn.filter(
                            (app) => app !== "spotstitch"
                          ),
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">Spotstitch</div>
                    <div className="text-xs text-gray-500">
                      Public social discovery app
                    </div>
                  </div>
                </label>
              )}
              {user.joinedApps.includes("coquest") && (
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.visibleIn.includes("coquest")}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          visibleIn: [...prev.visibleIn, "coquest"],
                        }));
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          visibleIn: prev.visibleIn.filter(
                            (app) => app !== "coquest"
                          ),
                        }));
                      }
                    }}
                    className="mr-2"
                  />
                  <div>
                    <div className="font-medium">CoQuest</div>
                    <div className="text-xs text-gray-500">
                      Internal cooperative management tool
                    </div>
                  </div>
                </label>
              )}
            </div>
            {formData.visibleIn.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Please select at least one app
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.location[0]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: [parseFloat(e.target.value), prev.location[1]],
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.location[1]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location: [prev.location[0], parseFloat(e.target.value)],
                  }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formData.visibleIn.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Layer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced LayerCard with click handler
const LayerCard = ({ layer, onClick }) => {
  const getTypeIcon = (type) => {
    if (type.includes("events")) return <Calendar className="w-5 h-5" />;
    if (type.includes("commerce") || type.includes("market"))
      return <Store className="w-5 h-5" />;
    if (type.includes("social") || type.includes("community"))
      return <Users className="w-5 h-5" />;
    if (type.includes("food")) return <Coffee className="w-5 h-5" />;
    if (type.includes("fitness")) return <Heart className="w-5 h-5" />;
    if (type.includes("business")) return <Briefcase className="w-5 h-5" />;
    if (type.includes("music")) return <Music className="w-5 h-5" />;
    if (type.includes("photography")) return <Camera className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  const getTypeColor = (type) => {
    if (type.startsWith("spotstitch-")) {
      return "bg-indigo-100 text-indigo-800";
    } else if (type.startsWith("coquest-")) {
      return "bg-emerald-100 text-emerald-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getVisibilityColor = (visibility) => {
    switch (visibility) {
      case "public":
        return "bg-green-100 text-green-800";
      case "shared":
        return "bg-blue-100 text-blue-800";
      case "private":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case "public":
        return <Globe className="w-3 h-3" />;
      case "shared":
        return <Share2 className="w-3 h-3" />;
      case "private":
        return <Lock className="w-3 h-3" />;
      default:
        return <Eye className="w-3 h-3" />;
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer hover:border-indigo-200"
      onClick={() => onClick(layer)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${getTypeColor(layer.type)}`}>
            {getTypeIcon(layer.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{layer.title}</h3>
            <p className="text-sm text-gray-500">
              {layer.location[0].toFixed(4)}, {layer.location[1].toFixed(4)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getVisibilityColor(
              layer.visibility
            )}`}
          >
            {getVisibilityIcon(layer.visibility)}
            <span>{layer.visibility}</span>
          </span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {layer.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {layer.visibleIn.includes("spotstitch") && (
            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs font-medium">
              Spotstitch
            </span>
          )}
          {layer.visibleIn.includes("coquest") && (
            <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
              CoQuest
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3 text-xs text-gray-500">
          <span>{layer.posts} posts</span>
          <span>{layer.followers} followers</span>
        </div>
      </div>
    </div>
  );
};

// Enhanced LoginScreen with SSO simulation
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("login"); // 'login' or 'sso'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStep("sso");
    console.log(email);

    try {
      // Simulate central auth system lookup

      const user = await centralAuth.authenticate(email);
      onLogin(user);
    } catch (error) {
      console.error("Authentication failed:", error);
      setStep("login");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email) => {
    try {
      setLoading(true);
      const user = await centralAuth.authenticate(email); // ✅ pass directly
      onLogin(user);
    } catch (err) {
      console.error("Quick login failed:", err);
      setStep("login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Layers</h1>
          <p className="text-gray-600">
            Unified access to Spotstitch & CoQuest
          </p>
        </div>

        {step === "login" && (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Single Sign-On</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="text-center text-sm text-gray-500 mb-4">
                Quick login for demo:
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => quickLogin("admin@layers.com")}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">Admin User</div>
                  <div className="text-sm text-gray-500">
                    admin@layers.com - Full access
                  </div>
                </button>
                <button
                  onClick={() => quickLogin("john@spotstitch.com")}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">
                    Spotstitch User
                  </div>
                  <div className="text-sm text-gray-500">
                    john@spotstitch.com - Spotstitch only
                  </div>
                </button>
                <button
                  onClick={() => quickLogin("sarah@coquest.coop")}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">CoQuest User</div>
                  <div className="text-sm text-gray-500">
                    sarah@coquest.coop - CoQuest only
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {step === "sso" && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Authenticating with Central Auth
            </h3>
            <p className="text-gray-600 mb-4">
              Checking your access across all platforms...
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Verifying credentials</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Loading user profile</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Syncing app permissions</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span>Spotstitch</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>CoQuest</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component with UserContext
const App = () => {
  const [user, setUser] = useState(null);
  const [layers, setLayers] = useState([]);
  const [filteredLayers, setFilteredLayers] = useState([]);
  const [currentApp, setCurrentApp] = useState("spotstitch");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLayerDetails, setShowLayerDetails] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadLayers();
    }
  }, [user, currentApp, typeFilter]);

  const loadLayers = async () => {
    setLoading(true);
    const allLayers = await mockAPI.getLayers(
      currentApp,
      typeFilter === "all" ? null : typeFilter,
      user
    );
    setLayers(allLayers);
    setFilteredLayers(allLayers);
    setLoading(false);
  };

  const handleCreateLayer = async (layerData) => {
    const newLayer = await mockAPI.createLayer(layerData, user);
    setLayers((prev) => {
      const updated = [...prev, newLayer];
      setFilteredLayers(updated);
      return updated;
    });
    setShowCreateModal(false);
  };

  const handleLayerClick = (layer) => {
    setSelectedLayer(layer);
    setShowLayerDetails(true);
  };

  const handleLogout = () => {
    setUser(null);
    setLayers([]);
    setFilteredLayers([]);
    setCurrentApp("spotstitch");
  };

  const getAvailableTypes = () => {
    const types = new Set(["all"]);
    layers.forEach((layer) => {
      if (layer.type.startsWith(currentApp + "-")) {
        types.add(layer.type);
      }
    });
    return Array.from(types);
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <div className="h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "w-80" : "w-16"
          } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-100 w-10 h-10 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Layers</h1>
                    <p className="text-xs text-gray-500">Shared Backend</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {sidebarOpen && (
            <>
              {/* User Profile */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-0.5 text-xs rounded ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-700"
                            : user.role === "moderator"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-indigo-600">
                      {user.reputation}
                    </div>
                    <div className="text-xs text-gray-500">Reputation</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600">
                      {user.postsCount}
                    </div>
                    <div className="text-xs text-gray-500">Posts</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">
                      {user.layersCount}
                    </div>
                    <div className="text-xs text-gray-500">Layers</div>
                  </div>
                </div>
              </div>

              {/* App Switcher */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Switch Apps
                </h3>
                <div className="space-y-2">
                  {user.joinedApps.includes("spotstitch") && (
                    <button
                      onClick={() => setCurrentApp("spotstitch")}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        currentApp === "spotstitch"
                          ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium">Spotstitch</div>
                      <div className="text-xs opacity-75">
                        Public Social Discovery
                      </div>
                    </button>
                  )}
                  {user.joinedApps.includes("coquest") && (
                    <button
                      onClick={() => setCurrentApp("coquest")}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        currentApp === "coquest"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-medium">CoQuest</div>
                      <div className="text-xs opacity-75">
                        Cooperative Management
                      </div>
                    </button>
                  )}
                </div>
                {!user.joinedApps.includes(currentApp) && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                    You don't have access to {currentApp}. Contact an admin for
                    access.
                  </div>
                )}
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Filters</h3>
                  <Filter className="w-4 h-4 text-gray-500" />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Types</option>
                  {getAvailableTypes()
                    .filter((type) => type !== "all")
                    .map((type) => (
                      <option key={type} value={type}>
                        {type
                          .replace(currentApp + "-", "")
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </option>
                    ))}
                </select>
              </div>

              {/* Actions */}
              <div className="p-4 border-b border-gray-200">
                <button
                  onClick={() => setShowCreateModal(true)}
                  disabled={!user.joinedApps.includes(currentApp)}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Layer</span>
                </button>
              </div>

              {/* Layers List */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Layers ({filteredLayers.length})
                  </h3>
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  )}
                </div>
                <div className="space-y-3">
                  {filteredLayers.map((layer) => (
                    <LayerCard
                      key={layer.id}
                      layer={layer}
                      onClick={handleLayerClick}
                    />
                  ))}
                  {filteredLayers.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No layers found</p>
                      <p className="text-sm">
                        {!user.joinedApps.includes(currentApp)
                          ? `You don't have access to ${currentApp}`
                          : "Try changing your filters or create a new layer"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Interactive Map
                </h2>
                <p className="text-gray-600">
                  Showing {filteredLayers.length} layers for{" "}
                  <span className="font-medium">{currentApp}</span>
                  {!user.joinedApps.includes(currentApp) && (
                    <span className="text-red-600 ml-2">(No Access)</span>
                  )}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">
                  Total:{" "}
                  <span className="font-medium text-gray-900">
                    {layers.length}
                  </span>
                </div>
                {currentApp === "spotstitch" && (
                  <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    Public Discovery
                  </div>
                )}
                {currentApp === "coquest" && (
                  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                    Co-op Management
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 p-4">
            <LeafletMap
              layers={filteredLayers}
              onLayerClick={handleLayerClick}
              currentApp={currentApp}
            />
          </div>
        </div>

        {/* Modals */}
        <CreateLayerModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateLayer}
          currentApp={currentApp}
        />

        <LayerDetailsModal
          layer={selectedLayer}
          isOpen={showLayerDetails}
          onClose={() => {
            setShowLayerDetails(false);
            setSelectedLayer(null);
          }}
          currentApp={currentApp}
        />
      </div>
    </UserContext.Provider>
  );
};

export default App;
