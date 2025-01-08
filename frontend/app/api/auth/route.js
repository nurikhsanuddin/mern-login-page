// app/api/auth/route.js
import { NextResponse } from "next/server";
import axios from "axios";

// Fungsi untuk menangani login dan register
export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    if (name) {
      console.log('Attempting to register with:', { email, name }); // Debug log
      
      const registerResponse = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      
      console.log('Register response:', registerResponse.data); // Debug log
      return NextResponse.json(registerResponse.data, { status: 200 });
    } else {
      // Login route
      const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      return NextResponse.json(loginResponse.data, { status: 200 });
    }
  } catch (error) {
    console.error('Auth error:', error.response?.data); // Debug log
    
    if (error.response) {
      // Return the exact error from the backend
      return NextResponse.json(
        { message: error.response.data.message }, 
        { status: error.response.status }
      );
    }
    
    // Handle network or other errors
    return NextResponse.json(
      { message: "Connection error or server unreachable" }, 
      { status: 500 }
    );
  }
}
