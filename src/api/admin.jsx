import { BASE_URL } from "./config";

// Courses
export async function createCourse({ course_code, course_name }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(`${BASE_URL}/admin/course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
      body: JSON.stringify({ course_code, course_name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create course");
    return data;
  } catch (err) {
    console.error("createCourse failed:", err);
    throw err;
  }
}

export async function getCourses({ page = 1, limit = 10, search = "" }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/course?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch courses");
    return data;
  } catch (err) {
    console.error("getCourses failed:", err);
    throw err;
  }
}

export async function editCourse({ course_code, course_name }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/course?course_code=${encodeURIComponent(course_code)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
        body: JSON.stringify({ course_code, course_name }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update course");
    return data;
  } catch (err) {
    console.error("editCourse failed:", err);
    throw err;
  }
}

export async function deleteCourse({ course_code, delete_all = false }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const query = delete_all
      ? `delete_all=true`
      : `course_code=${encodeURIComponent(course_code)}`;

    const res = await fetch(`${BASE_URL}/admin/course?${query}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete course");
    return data;
  } catch (err) {
    console.error("deleteCourse failed:", err);
    throw err;
  }
}

// Department
export async function createDepartment({ department_name }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(`${BASE_URL}/admin/department`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
      body: JSON.stringify({ department_name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create department");
    return data;
  } catch (err) {
    console.error("createDepartment failed:", err);
    throw err;
  }
}

export async function getDepartments({ page = 1, limit = 10, search = "" }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/department?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch departments");
    return data;
  } catch (err) {
    console.error("getDepartments failed:", err);
    throw err;
  }
}

export async function updateDepartment({ department_id, department_name }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/department?department_id=${department_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
        body: JSON.stringify({ department_name }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update department");
    return data;
  } catch (err) {
    console.error("editDepartment failed:", err);
    throw err;
  }
}

export async function deleteDepartment({ department_id, delete_all = false }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const query = delete_all
      ? `delete_all=true`
      : `department_id=${department_id}`;

    const res = await fetch(`${BASE_URL}/admin/department?${query}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete department");
    return data;
  } catch (err) {
    console.error("deleteDepartment failed:", err);
    throw err;
  }
}

// Scholarship Forms
export async function createScholarshipForm({ scholarship_form_name, file }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const formData = new FormData();
  formData.append("scholarship_form_name", scholarship_form_name);
  formData.append("scholarship_form", file);

  try {
    const res = await fetch(`${BASE_URL}/admin/scholarship-form`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create scholarship form");
    return data;
  } catch (err) {
    console.error("createScholarshipForm failed:", err);
    throw err;
  }
}

export async function getScholarshipForms({ page = 1, limit = 10, search = "" }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/scholarship-form?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch scholarship forms");
    return data;
  } catch (err) {
    console.error("getScholarshipForms failed:", err);
    throw err;
  }
}

export async function editScholarshipForm({ scholarship_form_id, scholarship_form_name, file }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const formData = new FormData();
  if (scholarship_form_name) formData.append("scholarship_form_name", scholarship_form_name);
  if (file) formData.append("scholarship_form", file);

  try {
    const res = await fetch(
      `${BASE_URL}/admin/scholarship-forms?scholarship_form_id=${scholarship_form_id}`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update scholarship form");
    return data;
  } catch (err) {
    console.error("editScholarshipForm failed:", err);
    throw err;
  }
}

export async function deleteScholarshipForm({ scholarship_form_id, delete_all = false }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const query = delete_all
      ? `delete_all=true`
      : `scholarship_form_id=${scholarship_form_id}`;

    const res = await fetch(`${BASE_URL}/admin/scholarship-form?${query}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete scholarship form");
    return data;
  } catch (err) {
    console.error("deleteScholarshipForm failed:", err);
    throw err;
  }
}

// Profile
export async function getProfile() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(`${BASE_URL}/admin/profile`, {
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

export async function updateProfile({ first_name, last_name, department }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(`${BASE_URL}/admin/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
      body: JSON.stringify({ first_name, last_name, department }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile");
    return data;
  } catch (err) {
    console.error("updateProfile failed:", err);
    throw err;
  }
}

// Scholarships
export async function createScholarship({
  scholarship_title,
  description,
  start_date,
  end_date,
  status,
  amount,
  course_codes = [],
  scholarship_form_ids = [],
}) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(`${BASE_URL}/admin/scholarship`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userData.api_key || ""}`,
        "X-CSRF-Token": userData.csrf_token || "",
      },
      body: JSON.stringify({
        scholarship_title,
        description,
        start_date,
        end_date,
        status,
        amount,
        course_codes,
        scholarship_form_ids,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create scholarship");
    return data;
  } catch (err) {
    console.error("createScholarship failed:", err);
    throw err;
  }
}

export async function getScholarships({ page = 1, limit = 10, search = "" }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/scholarship?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
      }
    );

    const data = await res.json();
    console.log(data);
    if (!res.ok) throw new Error(data.error || "Failed to fetch scholarships");
    return data;
  } catch (err) {
    console.error("getScholarships failed:", err);
    throw err;
  }
}

export async function updateScholarship({
  scholarship_id,
  scholarship_title,
  description,
  start_date,
  end_date,
  status,
  amount,
  course_codes,
  scholarship_form_ids,
}) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/scholarship?scholarship_id=${scholarship_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
        body: JSON.stringify({
          scholarship_title,
          description,
          start_date,
          end_date,
          status,
          amount,
          course_codes,
          scholarship_form_ids,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update scholarship");
    return data;
  } catch (err) {
    console.error("editScholarship failed:", err);
    throw err;
  }
}

export async function deleteScholarship({ scholarship_id }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/scholarship?scholarship_id=${scholarship_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.api_key || ""}`,
          "X-CSRF-Token": userData.csrf_token || "",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete scholarship");
    return data;
  } catch (err) {
    console.error("deleteScholarship failed:", err);
    throw err;
  }
}

// Accounts
export async function getAdmins({ page = 1, limit = 10, search = "", status = "all" }) {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  try {
    const res = await fetch(
      `${BASE_URL}/admin/accounts?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.api_key || ""}`,  
          "X-CSRF-Token": userData.csrf_token || "",
        },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch admins");
    return data;
  } catch (err) {
    console.error("getAdmins failed:", err);
    throw err;
  }
}

export async function updateAdminStatus({ userId, status }) {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  try {
    const res = await fetch(`${BASE_URL}/admin/accounts`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,  
        "X-CSRF-Token": userData.csrf_token || "",
      },
      body: JSON.stringify({ user_id: userId, status }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update admin");
    return data;
  } catch (err) {
    console.error("updateAdminStatus failed:", err);
    throw err;
  }
}

export async function deleteAdmin({ userId }) {
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  try {
    const res = await fetch(`${BASE_URL}/admin/accounts?user_id=${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userData.api_key || ""}`,  
        "X-CSRF-Token": userData.csrf_token || "",
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete admin");
    return data;
  } catch (err) {
    console.error("deleteAdmin failed:", err);
    throw err;
  }
}