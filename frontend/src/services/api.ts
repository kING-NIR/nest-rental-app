import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

class APIService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({ baseURL: API_URL });
    this.token = localStorage.getItem("token");

    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem("token");
  }

  // Auth
  async signup(name: string, contact: string, password: string, role: string) {
    const response = await this.api.post("/auth/signup", { name, contact, password, role });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async login(contact: string, password: string) {
    const response = await this.api.post("/auth/login", { contact, password });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async verifyToken() {
    return await this.api.get("/auth/verify");
  }

  // Properties
  async getProperties(filters?: { city?: string; type?: string; available?: boolean }) {
    return await this.api.get("/properties", { params: filters });
  }

  async getMyProperties() {
    return await this.api.get("/properties/my-properties");
  }

  async getPropertyById(id: string) {
    return await this.api.get(`/properties/${id}`);
  }

  async createProperty(data: any) {
    return await this.api.post("/properties", data);
  }

  async updateProperty(id: string, data: any) {
    return await this.api.put(`/properties/${id}`, data);
  }

  async deleteProperty(id: string) {
    return await this.api.delete(`/properties/${id}`);
  }

  // Tasks
  async getTasks(filters?: any) {
    return await this.api.get("/operations/tasks", { params: filters });
  }

  async createTask(data: any) {
    return await this.api.post("/operations/tasks", data);
  }

  async updateTask(id: string, data: any) {
    return await this.api.put(`/operations/tasks/${id}`, data);
  }

  // Appointments
  async getAppointments(filters?: any) {
    return await this.api.get("/operations/appointments", { params: filters });
  }

  async createAppointment(data: any) {
    return await this.api.post("/operations/appointments", data);
  }

  async updateAppointment(id: string, data: any) {
    return await this.api.put(`/operations/appointments/${id}`, data);
  }

  // Payments
  async getPayments(filters?: any) {
    return await this.api.get("/operations/payments", { params: filters });
  }

  async recordPayment(id: string) {
    return await this.api.put(`/operations/payments/${id}`);
  }

  // Messages
  async getMessages(recipientId: string) {
    return await this.api.get("/operations/messages", { params: { recipientId } });
  }

  async sendMessage(data: any) {
    return await this.api.post("/operations/messages", data);
  }
}

export default new APIService();
