

import { NextResponse } from "next/server";
import { toast } from "react-toastify";


export function middleware(req) {
  const token = req.cookies.get("token")?.value;

 const role=req.cookies.get("role")?.value

  console.log("🚀 ~ middleware ~ token:", token);
  console.log("🚀 ~ middleware ~ role:", role);

  if (!token) {
    console.log("🚀 ~ middleware ~ token:", token);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (role === "admin") {
    return NextResponse.next();
  } else if (role === "user") {
    return NextResponse.next();
  } else {
    console.log(
      "🚀 ~ middleware ~ Unrecognized role, redirecting to unauthorized."
    );
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
}

export const config = {
  matcher: ["/showusers", "/profile", "/admin"],
};
