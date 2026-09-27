/**
 * Centralized API client for LocalHub Backend Authentication.
 * Routes all auth requests directly to the FastAPI Gateway.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function loginWithBackend({ email, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Authentication failed." };
    }
    return {
      success: true,
      token: data.access_token,
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    return { success: false, error: err.message || "Failed to reach authentication server." };
  }
}

export async function registerWithBackend({ email, password, fullName, phone, role = "customer", shop_id = null }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        full_name: fullName,
        phone: phone || "+91 98000 00000",
        role,
        shop_id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Registration failed." };
    }
    return {
      success: true,
      token: data.access_token,
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    return { success: false, error: err.message || "Failed to connect to authentication server." };
  }
}

export async function sendRegistrationOtp({ email, fullName }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        full_name: fullName || "Customer",
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Failed to send verification code." };
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message || "Failed to connect to authentication server." };
  }
}

export async function verifyRegistrationOtp({ email, otp, password, fullName, phone, role = "customer", shop_id = null }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        password,
        full_name: fullName,
        phone: phone || "+91 98000 00000",
        role,
        shop_id,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Verification failed." };
    }
    return {
      success: true,
      token: data.access_token,
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    return { success: false, error: err.message || "Failed to connect to authentication server." };
  }
}

export async function sendBackendOtp({ phone }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Failed to send OTP." };
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message || "Network error while sending OTP." };
  }
}

export async function verifyBackendOtp({ phone, otp }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Invalid verification code." };
    }
    return {
      success: true,
      token: data.access_token,
      user: data.user,
      session: data.session,
    };
  } catch (err) {
    return { success: false, error: err.message || "Network error during verification." };
  }
}

export async function fetchCurrentBackendUser(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function logoutWithBackend(token) {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function requestPasswordReset({ email }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Unable to send reset verification code." };
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message || "Failed to reach server. Please try again." };
  }
}

export async function resetPasswordWithBackend({ email, otp, newPassword }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Failed to reset password." };
    }
    return { success: true, ...data };
  } catch (err) {
    return { success: false, error: err.message || "Failed to reach server. Please try again." };
  }
}

