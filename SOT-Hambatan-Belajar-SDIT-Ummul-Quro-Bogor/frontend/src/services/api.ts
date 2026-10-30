/**
 * API Client — Integrasi Frontend dengan Backend Laravel SiPakar
 */

const API_BASE_URL = '/api';

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = {
  getToken(): string | null {
    return localStorage.getItem('sipakar_token');
  },

  setToken(token: string) {
    localStorage.setItem('sipakar_token', token);
  },

  clearToken() {
    localStorage.removeItem('sipakar_token');
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.message || `Terjadi kesalahan (Kode: ${response.status})`;
      throw new ApiError(response.status, errorMsg, data);
    }

    return data as T;
  },

  // Auth endpoints
  async login(email: string, password: string) {
    const res = await this.request<{
      message: string;
      token: string;
      user: { id: number; name: string; email: string; role: string; classes: any[] };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'guru_bk' | 'wali_kelas';
    class_id?: number | null;
  }) {
    const res = await this.request<{
      message: string;
      token: string;
      user: { id: number; name: string; email: string; role: string; classes: any[] };
      redirected_to_wali?: boolean;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(res.token);
    return res;
  },

  async getPublicClasses() {
    return this.request<{
      classes: Array<{ id: number; grade_level: number; name: string; academic_year: string }>;
    }>('/public/classes');
  },

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  },

  async getMe() {
    return this.request<{
      user: { id: number; name: string; email: string; role: string; classes: any[] };
    }>('/auth/me');
  },

  // Classes & Students
  async getMyClasses() {
    return this.request<{ classes: Array<{ id: number; grade_level: number; name: string; academic_year: string; students_count: number }> }>(
      '/classes/mine'
    );
  },

  async getClassStudents(classId: number) {
    return this.request<{
      class: { id: number; name: string; grade_level: number; academic_year: string };
      students: Array<{ id: number; student_code: string; name: string; is_active: boolean }>;
    }>(`/classes/${classId}/students`);
  },

  async getStudent(studentId: number) {
    return this.request<{
      student: any;
      screenings: any[];
    }>(`/students/${studentId}`);
  },

  // Knowledge Base
  async getActiveKb() {
    return this.request<{
      kb_version: {
        id: number;
        version_code: string;
        status: string;
        reviewer_name: string;
        hypotheses: Array<{
          id: number;
          code: string;
          name: string;
          description: string;
          cf_rules: Array<{
            id: number;
            indicator: {
              id: number;
              code: string;
              operational_text: string;
              observation_guide: string;
            };
            expert_mb: number;
            expert_md: number;
            expert_cf: number;
          }>;
        }>;
      };
    }>('/kb/active');
  },

  // Screenings
  async getScreenings() {
    return this.request<{ data: any[] }>('/screenings');
  },

  async createScreening(studentId: number, observationPeriod: string) {
    return this.request<{
      message: string;
      screening: any;
    }>('/screenings', {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, observation_period: observationPeriod }),
    });
  },

  async saveScreeningAnswers(screeningId: number, answers: Array<{ indicator_id: number; answer_value: string }>) {
    return this.request<{ message: string; count: number }>(`/screenings/${screeningId}/answers`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  async calculateScreening(screeningId: number) {
    return this.request<{
      message: string;
      screening: any;
      results: any[];
      disclaimer: string;
    }>(`/screenings/${screeningId}/calculate`, {
      method: 'POST',
    });
  },

  async getScreeningResult(screeningId: number) {
    return this.request<{
      screening: any;
      disclaimer: string;
    }>(`/screenings/${screeningId}/result`);
  },

  async addFollowUp(screeningId: number, payload: { action_type: string; notes: string; review_date?: string; status?: string }) {
    return this.request<{
      message: string;
      follow_up: any;
    }>(`/screenings/${screeningId}/follow-ups`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async reviewScreening(screeningId: number, status: 'reviewed' | 'completed', notes?: string) {
    return this.request<{
      message: string;
      screening: any;
    }>(`/screenings/${screeningId}/review`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Reports
  async getAggregateReport() {
    return this.request<{
      report_title: string;
      privacy_notice: string;
      total_screenings: number;
      by_indication_level: Array<{ indication_level: string; total: number }>;
      by_hypothesis: Array<{ hypothesis_code: string; hypothesis_name: string; indication_level: string; count: number }>;
    }>('/reports/aggregate');
  },

  // Admin
  async getKbVersions() {
    return this.request<{ versions: any[] }>('/admin/kb-versions');
  },

  async activateKbVersion(id: number) {
    return this.request<{ message: string; version: any }>(`/admin/kb-versions/${id}/activate`, {
      method: 'POST',
    });
  },

  async getAuditLogs() {
    return this.request<{ data: any[] }>('/admin/audit-logs');
  },

  // Knowledge Base CRUD (Admin & Guru BK)
  async createHypothesis(payload: { kb_version_id: number; code: string; name: string; description?: string }) {
    return this.request<{ message: string; hypothesis: any }>('/admin/hypotheses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateHypothesis(id: number, payload: { code?: string; name?: string; description?: string }) {
    return this.request<{ message: string; hypothesis: any }>(`/admin/hypotheses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteHypothesis(id: number) {
    return this.request<{ message: string }>(`/admin/hypotheses/${id}`, {
      method: 'DELETE',
    });
  },

  async createIndicator(payload: { kb_version_id: number; code: string; operational_text: string; observation_guide?: string }) {
    return this.request<{ message: string; indicator: any }>('/admin/indicators', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateIndicator(id: number, payload: { code?: string; operational_text?: string; observation_guide?: string }) {
    return this.request<{ message: string; indicator: any }>(`/admin/indicators/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteIndicator(id: number) {
    return this.request<{ message: string }>(`/admin/indicators/${id}`, {
      method: 'DELETE',
    });
  },

  async createRule(payload: { hypothesis_id: number; indicator_id: number; expert_mb: number; expert_md: number }) {
    return this.request<{ message: string; rule: any }>('/admin/cf-rules', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateRule(id: number, payload: { expert_mb: number; expert_md: number }) {
    return this.request<{ message: string; rule: any }>(`/admin/cf-rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteRule(id: number) {
    return this.request<{ message: string }>(`/admin/cf-rules/${id}`, {
      method: 'DELETE',
    });
  },
};
