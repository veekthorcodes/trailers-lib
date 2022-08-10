import { NextResponse } from "next/server";
import { verifyToken } from "@utils/verifyToken";
import { spawn } from "child_process";

export async function middleware(req, ev) {
  const token = req ? req.cookies?.token : null;
  const userId = await verifyToken(token);
  const { pathname } = req.nextUrl;

  if ((token && userId) || pathname.includes("/api/login")) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
