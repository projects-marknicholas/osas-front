import { BASE_URL } from "./config";

// Courses
export async function getCourses(page = 1, limit = 10, search = "") {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const queryParams = new URLSearchParams({ page, limit, search }).toString();
    const res = await fetch(`${BASE_URL}/student/course?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch courses");
    return data;
  } catch (err) {
    console.error("getCourses failed:", err);
    throw err;
  }
}

// Scholarships
export async function getScholarships({ page = 1, limit = 10, search = "" }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const queryParams = new URLSearchParams({ page, limit, search }).toString();
    const res = await fetch(`${BASE_URL}/student/scholarship?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
    });

    if (!res.ok) {
      const text = await res.text(); // Debugging
      throw new Error(text);
    }

    return await res.json();
  } catch (err) {
    console.error("getScholarships failed:", err);
    throw err;
  }
}

export async function applyScholarship(scholarshipId, files = {}) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const formData = new FormData();
    formData.append("scholarship_id", scholarshipId);

    // Append uploaded files if available
    Object.entries(files).forEach(([formName, file]) => {
      formData.append(`files[${formName}]`, file);
    });

    const res = await fetch(`${BASE_URL}/student/apply`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text(); // Debugging
      throw new Error(text);
    }

    return await res.json();
  } catch (err) {
    console.error("applyScholarship failed:", err);
    throw err;
  }
}

// Profile
export async function getProfile() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(`${BASE_URL}/student/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch profile");
    return data;
  } catch (err) {
    console.error("getProfile failed:", err);
    throw err;
  }
}

export async function updateProfile(updates) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(`${BASE_URL}/student/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile");
    return data;
  } catch (err) {
    console.error("updateProfile failed:", err);
    throw err;
  }
}

// Applications
export async function getApplications(page = 1, limit = 10) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const queryParams = new URLSearchParams({ page, limit }).toString();
    const res = await fetch(`${BASE_URL}/student/applications?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch applications");
    return data;
  } catch (err) {
    console.error("getApplications failed:", err);
    throw err;
  }
}

// Announcements
export async function getAnnouncements(page = 1, limit = 10, search = "") {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const queryParams = new URLSearchParams({ page, limit, search }).toString();
    const res = await fetch(`${BASE_URL}/student/announcement?${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch announcements");
    return data;
  } catch (err) {
    console.error("getAnnouncements failed:", err);
    throw err;
  }
}