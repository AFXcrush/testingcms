import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();
  const correctPassword = process.env.OPENCMSWINDOW;

  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}
