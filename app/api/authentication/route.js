import { cookies } from "next/headers";

export async function POST(request) {
  cookies().set("isLoggedIn", true);

  const cookieStore = cookies().get("isLoggedIn");

  return new Response(JSON.stringify(cookieStore));
}

export async function GET(request) {
  cookies().delete("isLoggedIn");

  const cookieStore = cookies().getAll();

  return new Response(JSON.stringify(cookieStore));
}
