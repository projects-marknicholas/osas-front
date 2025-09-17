import { BASE_URL } from "./config";

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