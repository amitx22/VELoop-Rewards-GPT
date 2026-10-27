const API_BASE = 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.token = localStorage.getItem('veloop_token') || null;
    this.currentUserId = localStorage.getItem('veloop_user_id') || 'VE10025'; // Default to Rahul Sharma (Winner & active user)
  }

  setAuth(token, userId) {
    this.token = token;
    this.currentUserId = userId;
    if (token) {
      localStorage.setItem('veloop_token', token);
    } else {
      localStorage.removeItem('veloop_token');
    }
    if (userId) {
      localStorage.setItem('veloop_user_id', userId);
    } else {
      localStorage.removeItem('veloop_user_id');
    }
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    if (this.currentUserId) {
      headers['x-user-id'] = this.currentUserId;
    }
    return headers;
  }

  async fetchJson(endpoint, options = {}) {
    const headers = this.getHeaders(options.headers);
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await response.json();
    if (!response.ok) {
      const err = new Error(data.message || 'API Request failed');
      err.errorCode = data.errorCode || 'UNKNOWN_ERROR';
      err.status = response.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  // Auth endpoints
  async getMe() {
    return this.fetchJson('/auth/me');
  }

  async login(identifier, password) {
    const res = await this.fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
    this.setAuth(res.token, res.user.userId);
    return res;
  }

  async register({ fullName, email, password }) {
    const res = await this.fetchJson('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
    this.setAuth(res.token, res.user.userId);
    return res;
  }

  async logout() {
    try {
      await this.fetchJson('/auth/logout', { method: 'POST' });
    } catch (e) {}
    this.setAuth(null, null);
    return { success: true };
  }

  async switchUser(userId) {
    const res = await this.fetchJson('/auth/switch-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
    this.setAuth(res.token, userId === 'VISITOR' ? null : userId);
    return res;
  }

  async addBalance(currency, amount) {
    return this.fetchJson('/auth/add-balance', {
      method: 'POST',
      body: JSON.stringify({ currency, amount }),
    });
  }

  // Giveaway endpoints
  async getCurrentGiveaway() {
    return this.fetchJson('/giveaways/current');
  }

  async getGiveawayById(idOrSlug) {
    return this.fetchJson(`/giveaways/${idOrSlug}`);
  }

  async getPreviousGiveaways() {
    return this.fetchJson('/giveaways/previous');
  }

  async getAllGiveaways() {
    return this.fetchJson('/giveaways/all');
  }

  async getGiveawayWinners(giveawayId) {
    return this.fetchJson(`/giveaways/${giveawayId}/winners`);
  }

  async getAllPreviousWinners() {
    return this.fetchJson('/giveaways/previous/winners');
  }

  async getMyParticipationStatus(giveawayId) {
    return this.fetchJson(`/giveaways/${giveawayId}/my-status`);
  }

  // Join giveaway with idempotency key
  async joinGiveaway(giveawayId, prizeId, explicitDeviceHash = null) {
    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return this.fetchJson(`/giveaways/${giveawayId}/join`, {
      method: 'POST',
      headers: {
        'x-idempotency-key': idempotencyKey,
      },
      body: JSON.stringify({
        giveawayId,
        prizeId,
        explicitDeviceHash,
      }),
    });
  }

  // Claim Prize
  async getMyClaim(giveawayId) {
    return this.fetchJson(`/giveaways/${giveawayId}/my-claim`);
  }

  async submitClaim(giveawayId, claimData) {
    return this.fetchJson(`/giveaways/${giveawayId}/claim`, {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
  }

  // Admin Controls (For live demo evaluation)
  async setGiveawayStatus(giveawayId, status) {
    return this.fetchJson('/admin/giveaway-status', {
      method: 'POST',
      body: JSON.stringify({ giveawayId, status }),
    });
  }

  async selectWinners(giveawayId) {
    return this.fetchJson('/admin/select-winners', {
      method: 'POST',
      body: JSON.stringify({ giveawayId }),
    });
  }

  async getAuditLogs() {
    return this.fetchJson('/admin/audit-logs');
  }

  async getFraudEvents() {
    return this.fetchJson('/admin/fraud-events');
  }

  async resetDemo() {
    return this.fetchJson('/admin/reset', { method: 'POST' });
  }
}

export const api = new ApiClient();
