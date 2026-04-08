import api from "./axiosInstance";

// ── Auth ─────────────────────────────────────────────
export const authApi = {
    register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe:    ()            => api.get("/auth/me"),
  saveEvent:(eventId)     => api.put(`/auth/save-event/${eventId}`),
};

// ── Events ────────────────────────────────────────────
export const eventsApi = {
  getAll:    (params)     => api.get("/events", { params }),
  getFeatured:()          => api.get("/events/featured"),
  getById:   (id)         => api.get(`/events/${id}`),
  create:    (data)       => api.post("/events", data),
  update:    (id, data)   => api.put(`/events/${id}`, data),
  delete:    (id)         => api.delete(`/events/${id}`),
  register:  (id)         => api.post(`/events/${id}/register`),
  cancel:    (id)         => api.delete(`/events/${id}/register`),
};

// ── Gallery ───────────────────────────────────────────
export const galleryApi = {
  getAll:  (params)       => api.get("/gallery", { params }),
  upload:  (formData)     => api.post("/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  delete:  (id)           => api.delete(`/gallery/${id}`),
};

// ── Contact & Subscribe ───────────────────────────────
export const contactApi = {
  submit:    (data)       => api.post("/contact", data),
};

export const subscribeApi = {
  subscribe: (data)       => api.post("/subscribe", data),
};

// ── Admin ─────────────────────────────────────────────
export const adminApi = {
  getStats:         ()    => api.get("/admin/stats"),
  getRegistrations: ()    => api.get("/admin/registrations"),
  markContactRead:  (id)  => api.patch(`/admin/contacts/${id}/read`),
};
