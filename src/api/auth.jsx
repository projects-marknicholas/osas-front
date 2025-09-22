import { BASE_URL } from "./config";

// Student
export async function studentLogin(credentials) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        student_number: credentials.studentNumber,
        password: credentials.password
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (err) {
    console.error("Student login failed:", err);
    throw err;
  }
}

export async function studentRegister(formData) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      body: formData,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || "Registration failed");
    }

    return result;
  } catch (err) {
    console.error("Student registration failed:", err);
    throw err;
  }
}

// Admin
export async function adminLogin(googleToken) {
  try {
    const res = await fetch(`${BASE_URL}/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ google_token: googleToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    return data;
  } catch (err) {
    console.error("Admin login failed:", err);
    throw err;
  }
} 