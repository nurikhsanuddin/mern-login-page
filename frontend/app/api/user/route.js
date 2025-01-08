// app/api/user/route.js
import { NextResponse } from "next/server";
import axios from "axios";

// Fungsi untuk mengambil data pengguna berdasarkan token
export async function GET(request) {
  const token = request.headers.get("Authorization");

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Ensure token has Bearer prefix
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    const response = await axios.get("http://localhost:5000/api/user/profile", {
      headers: {
        Authorization: formattedToken,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.response?.data?.message || "Error fetching user data" }, { status: 500 });
  }
}
