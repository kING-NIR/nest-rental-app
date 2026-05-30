import { useState, useEffect, useRef } from "react";
import {
  Home, Building, User, Search, ArrowLeft, LogOut,
  MapPin, Bed, Bath, Maximize2,
  Bell
} from "lucide-react";
import { useAuth } from "./hooks/useAuth";
import { THEME } from "./utils/theme";
import { fmt } from "./utils/formatters";
import { Avatar, Badge, Button, TextInput, Spinner, EmptyState, Card } from "./components/UI";
import api from "./services/api";
import { Property, Task, Appointment, Payment, Message } from "./types";

export default function App() {
  const { user, token, loading, login, logout } = useAuth();
  const [screen, setScreen] = useState(token ? "app" : "login");
  
  // Auth state
  const [loginVal, setLoginVal] = useState("");
  
  // App state
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState<any>(null);
  const [selProp, setSelProp] = useState<Property | null>(null);
  const [chatTarget, setChatTarget] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Data
  const [properties, setProperties] = useState<Property[]>([]);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Form states
  const [searchQ, setSearchQ] = useState("");
  const [fType, setFType] = useState("all");
  const [newP, setNewP] = useState({
    title: "",
    description: "",
    address: "",
    city: "Hyderabad",
    type: "Apartment",
    price: "",
    bedrooms: "2",
    bathrooms: "1",
    area: "",
    amenities: [] as string[],
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatTarget]);

  useEffect(() => {
    if (token && screen === "app") {
      loadData();
    }
  }, [token, screen, tab]);

  const loadData = async () => {
    try {
      setApiLoading(true);
      setError(null);

      const [propsRes, myPropsRes] = await Promise.all([
        api.getProperties(),
        api.getMyProperties(),
      ]);

      setProperties(propsRes.data);
      setMyProperties(myPropsRes.data);

      if (user?.role === "owner") {
        const [tasksRes, apptsRes, paysRes] = await Promise.all([
          api.getTasks({ forOwner: true }),
          api.getAppointments({ forOwner: true }),
          api.getPayments({ forOwner: true }),
        ]);
        setTasks(tasksRes.data);
        setAppointments(apptsRes.data);
        setPayments(paysRes.data);
      } else {
        const [tasksRes, apptsRes, paysRes] = await Promise.all([
          api.getTasks({ forTenant: true }),
          api.getAppointments({ forTenant: true }),
          api.getPayments({ forTenant: true }),
        ]);
        setTasks(tasksRes.data);
        setAppointments(apptsRes.data);
        setPayments(paysRes.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load data");
    } finally {
      setApiLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setError(null);
      await login(loginVal, "password123"); // Demo password
      setScreen("app");
      setTab("home");
    } catch (err) {
      setError("Login failed");
    }
  };

  const handleCreateProperty = async () => {
    try {
      if (!newP.title || !newP.price) {
        setError("Title and price required");
        return;
      }
      await api.createProperty(newP);
      await loadData();
      setNewP({
        title: "",
        description: "",
        address: "",
        city: "Hyderabad",
        type: "Apartment",
        price: "",
        bedrooms: "2",
        bathrooms: "1",
        area: "",
        amenities: [],
      });
      setModal(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create property");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          background: THEME.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!token) {
    return (
      <div
        style={{
          background: THEME.bg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 28px",
          color: THEME.text,
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ marginBottom: 52 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: 52,
                  fontFamily: "Cormorant Garamond,serif",
                  fontWeight: 700,
                  color: THEME.text,
                  lineHeight: 1,
                }}
              >
                nest
              </span>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: THEME.gold,
                  marginBottom: 6,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 11,
                color: THEME.gold,
                letterSpacing: 5,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              Premium Rentals
            </div>
          </div>

          <TextInput
            label="Phone or Email"
            value={loginVal}
            onChange={setLoginVal}
            placeholder="9999999991"
          />

          {error && (
            <div style={{ color: THEME.error, fontSize: 13, marginBottom: 12 }}>
              {error}
            </div>
          )}

          <Button onClick={handleLogin} disabled={!loginVal} style={{ width: "100%" }}>
            Login (Demo: Any Contact, pw: password123)
          </Button>
        </div>
      </div>
    );
  }

  // Main app content
  const isOwner = user?.role === "owner";
  const available = properties.filter((p) =>
    p.available &&
    p.ownerId !== user?.id &&
    (searchQ === "" || p.title.toLowerCase().includes(searchQ.toLowerCase())) &&
    (fType === "all" || p.type === fType)
  );

  const pendingPay = payments.find((p) => p.status === "pending");

  return (
    <div
      style={{
        background: THEME.bg,
        minHeight: "100vh",
        color: THEME.text,
        fontFamily: "DM Sans,sans-serif",
        maxWidth: 430,
        margin: "0 auto",
      }}
    >
      {/* Top navigation */}
      {tab === "home" && (
        <div
          style={{
            padding: "20px 20px 0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ fontSize: 24, fontFamily: "Cormorant Garamond,serif" }}>
            {isOwner ? "Dashboard" : "Explore"}
          </h1>
          <Avatar initials={user!.initials} color={user!.color} size={40} />
        </div>
      )}

      {/* Content */}
      <div style={{ paddingBottom: 76 }}>
        {apiLoading ? (
          <div style={{ padding: "40px 20px", textAlign: "center" }}>
            <Spinner />
          </div>
        ) : tab === "home" && isOwner ? (
          <div style={{ padding: "28px 20px" }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ color: THEME.textSec, fontSize: 13 }}>Welcome back,</div>
              <div
                style={{
                  fontSize: 32,
                  fontFamily: "Cormorant Garamond,serif",
                  fontWeight: 600,
                }}
              >
                {user!.name}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 24 }}>
              <Card style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: THEME.gold }}>
                  {myProperties.length}
                </div>
                <div style={{ fontSize: 11, color: THEME.textSec, marginTop: 4 }}>Properties</div>
              </Card>
              <Card style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 700, color: THEME.success }}>
                  {appointments.filter((a) => a.status === "pending").length}
                </div>
                <div style={{ fontSize: 11, color: THEME.textSec, marginTop: 4 }}>Requests</div>
              </Card>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: THEME.textMuted, marginBottom: 12 }}>
              My Properties
            </div>
            {myProperties.length === 0 ? (
              <EmptyState
                icon="🏠"
                title="No properties yet"
                action={{
                  label: "Add Property",
                  onClick: () => setModal({ type: "addProp" }),
                }}
              />
            ) : (
              myProperties.slice(0, 3).map((p) => (
                <Card key={p._id} style={{ cursor: "pointer" }} onClick={() => setSelProp(p)}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ color: THEME.textSec, fontSize: 12 }}>{fmt(p.price)}/mo</div>
                </Card>
              ))
            )}
          </div>
        ) : tab === "home" ? (
          // Tenant Explore
          <div style={{ padding: "28px 20px" }}>
            <div style={{ fontSize: 30, fontFamily: "Cormorant Garamond,serif", marginBottom: 16 }}>
              Find Your Home
            </div>

            <div style={{ position: "relative", marginBottom: 14 }}>
              <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search properties..."
                style={{
                  width: "100%",
                  background: THEME.card,
                  border: `1px solid ${THEME.border}`,
                  borderRadius: 14,
                  padding: "13px 16px 13px 40px",
                  color: THEME.text,
                  fontSize: 14,
                  fontFamily: "DM Sans,sans-serif",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {available.length === 0 ? (
              <EmptyState icon="🔍" title="No properties found" />
            ) : (
              available.map((p) => (
                <Card key={p._id} onClick={() => setSelProp(p)} style={{ cursor: "pointer" }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ color: THEME.textSec, fontSize: 12, marginBottom: 8 }}>{p.address}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: THEME.gold }}>{fmt(p.price)}</div>
                </Card>
              ))
            )}
          </div>
        ) : tab === "profile" ? (
          <div style={{ padding: "48px 20px" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <Avatar initials={user!.initials} color={user!.color} size={84} />
              <div style={{ fontSize: 28, fontFamily: "Cormorant Garamond,serif", marginTop: 16 }}>
                {user!.name}
              </div>
              <div style={{ color: THEME.textSec, fontSize: 13, marginTop: 4 }}>
                {user!.role.charAt(0).toUpperCase() + user!.role.slice(1)}
              </div>
            </div>

            <Button
              variant="danger"
              onClick={logout}
              style={{ width: "100%", borderRadius: 14, padding: "14px" }}
            >
              <LogOut size={16} /> Sign Out
            </Button>
          </div>
        ) : null}
      </div>

      {/* Property Detail */}
      {selProp && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: THEME.bg,
            zIndex: 50,
            overflowY: "auto",
            maxWidth: 430,
            margin: "0 auto",
            padding: "20px",
          }}
        >
          <button
            onClick={() => setSelProp(null)}
            style={{
              background: "none",
              border: "none",
              color: THEME.gold,
              cursor: "pointer",
              fontSize: 14,
              marginBottom: 16,
              padding: 0,
            }}
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 8 }}>{selProp.title}</div>
          <div style={{ color: THEME.textSec, fontSize: 12, marginBottom: 16 }}>
            <MapPin size={12} style={{ display: "inline", marginRight: 4 }} />
            {selProp.address}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <Card style={{ flex: 1, textAlign: "center" }}>
              <Bed size={16} color={THEME.gold} style={{ margin: "0 auto 5px" }} />
              <div style={{ fontSize: 12, color: THEME.textSec }}>{selProp.bedrooms} Bed</div>
            </Card>
            <Card style={{ flex: 1, textAlign: "center" }}>
              <Bath size={16} color={THEME.gold} style={{ margin: "0 auto 5px" }} />
              <div style={{ fontSize: 12, color: THEME.textSec }}>{selProp.bathrooms} Bath</div>
            </Card>
            <Card style={{ flex: 1, textAlign: "center" }}>
              <Maximize2 size={16} color={THEME.gold} style={{ margin: "0 auto 5px" }} />
              <div style={{ fontSize: 12, color: THEME.textSec }}>{selProp.area} sqft</div>
            </Card>
          </div>

          <div style={{ fontSize: 22, fontWeight: 700, color: THEME.gold, marginBottom: 20 }}>
            {fmt(selProp.price)}<span style={{ fontSize: 12 }}>/mo</span>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: THEME.textMuted, marginBottom: 8 }}>Description</div>
            <div style={{ color: THEME.textSec, fontSize: 13, lineHeight: 1.6 }}>{selProp.description}</div>
          </div>

          {selProp.amenities.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: THEME.textMuted, marginBottom: 8 }}>Amenities</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selProp.amenities.map((a) => (
                  <Badge key={a} label={a} color={THEME.gold} />
                ))}
              </div>
            </div>
          )}

          <Button onClick={() => setSelProp(null)} style={{ width: "100%", marginBottom: 20 }}>
            Close
          </Button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: THEME.surface,
          borderTop: `1px solid ${THEME.border}`,
          display: "flex",
          padding: "6px 0 18px",
          zIndex: 40,
        }}
      >
        {[
          { id: "home", label: "Home", icon: isOwner ? Home : Search },
          { id: "properties", label: "Properties", icon: Building },
          ...(isOwner ? [{ id: "requests", label: "Requests", icon: Bell }] : []),
          { id: "profile", label: "Profile", icon: User },
        ].map((t: any) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <div
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                cursor: "pointer",
                padding: "8px 0",
              }}
            >
              <Icon size={21} color={active ? THEME.gold : THEME.textMuted} strokeWidth={active ? 2.5 : 1.5} />
              <div
                style={{
                  fontSize: 10,
                  color: active ? THEME.gold : THEME.textMuted,
                  fontWeight: active ? 700 : 400,
                }}
              >
                {t.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
