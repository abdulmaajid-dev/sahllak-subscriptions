import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export default function middleware(request) {
  let LoginCookie = cookies().get("isLoggedIn");
  let url = request.url;

  if (!LoginCookie && url.includes("dashboard")) {
    return NextResponse.redirect("http://localhost:3000/");
  }

  if (LoginCookie && url === "http://localhost:3000/") {
    return NextResponse.redirect(
      "http://localhost:3000/dashboard/subscriptions"
    );
  }
}
