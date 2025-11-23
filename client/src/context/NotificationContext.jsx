import { createContext, useContext, useEffect, useState } from "react";
import { fetchNotifications } from "../services/notificationService.js";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [data, setData] = useState({
    today: [],
    overdue: [],
    upcoming: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchNotifications();
      setData(res);
      setUnread(res.total);
    } catch (err) {
      console.error("Notification load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 120000); // refresh every 2 minutes
    return () => clearInterval(id);
  }, []);

  const markAllRead = () => setUnread(0);

  return (
    <NotificationContext.Provider
      value={{
        notifications: data,
        loading,
        unread,
        refresh: load,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
};
