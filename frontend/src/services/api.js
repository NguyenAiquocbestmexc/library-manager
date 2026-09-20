const API_BASE = (import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace(/\/+$/, '') : '') + '/api';

// ==================== BOOKS API ====================
export async function fetchBooks(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.category && params.category !== 'Tất cả') query.append('category', params.category);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);

  const res = await fetch(`${API_BASE}/books?${query.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi khi tải danh sách sách');
  }
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi khi tải thống kê');
  }
  return res.json();
}

export async function fetchCategories() {
  const res = await fetch(`${API_BASE}/books/meta/categories`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi khi tải danh mục');
  }
  return res.json();
}

export async function createBook(bookData) {
  const res = await fetch(`${API_BASE}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi thêm sách');
  }
  return data;
}

export async function updateBook(id, bookData) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi cập nhật sách');
  }
  return data;
}

export async function deleteBook(id) {
  const res = await fetch(`${API_BASE}/books/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi xóa sách');
  }
  return data;
}

// ==================== BORROWS & CIRCULATION API ====================
export async function fetchBorrows(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);

  const res = await fetch(`${API_BASE}/borrows?${query.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi khi tải danh sách phiếu mượn');
  }
  return res.json();
}

export async function createBorrowTicket(ticketData) {
  const res = await fetch(`${API_BASE}/borrows`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi tạo phiếu mượn');
  }
  return data;
}

export async function returnBorrowTicket(id) {
  const res = await fetch(`${API_BASE}/borrows/${id}/return`, {
    method: 'PATCH'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi xác nhận trả sách');
  }
  return data;
}

export async function deleteBorrowTicket(id) {
  const res = await fetch(`${API_BASE}/borrows/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi xóa phiếu mượn');
  }
  return data;
}

// ==================== MEMBERS API ====================
export async function fetchMembers(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/members?${query.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi khi tải danh sách độc giả');
  }
  return res.json();
}

export async function createMember(memberData) {
  const res = await fetch(`${API_BASE}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi tạo độc giả');
  }
  return data;
}

export async function updateMember(id, memberData) {
  const res = await fetch(`${API_BASE}/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(memberData)
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi cập nhật độc giả');
  }
  return data;
}

export async function deleteMember(id) {
  const res = await fetch(`${API_BASE}/members/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Lỗi khi xóa độc giả');
  }
  return data;
}

export async function fetchMemberHistory(id) {
  const res = await fetch(`${API_BASE}/members/${id}/history`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi khi tải lịch sử độc giả');
  }
  return res.json();
}

// ==================== REPORTS & ANALYTICS API ====================
export async function fetchAnalyticsReport() {
  const res = await fetch(`${API_BASE}/reports/analytics`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Lỗi khi tải báo cáo phân tích');
  }
  return res.json();
}
