import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  exchangeCodeForAccessToken,
  getAccountDetails,
} from "../../../../lib/aurinko";
import { db } from "@/server/db";

export const GET = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ message: "User Unauthorized" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status != "success")
    return NextResponse.json(
      { message: "Failed To Link Account" },
      { status: 400 },
    );

  const code = params.get("code");
  if (!code)
    return NextResponse.json({ message: "Code Not Found" }, { status: 400 });

  const token = await exchangeCodeForAccessToken(code);
  if (!token)
    return NextResponse.json(
      { message: "Failed To Get Access Token" },
      { status: 400 },
    );

  const accountDetails = await getAccountDetails(token.accessToken);
  if (!accountDetails)
    return NextResponse.json(
      { message: "Failed To Get Account Details" },
      { status: 400 },
    );

  await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId: userId,
      accessToken: token.accessToken,
      email: accountDetails.email,
      name: accountDetails.name,
    },
  });

  return NextResponse.redirect(new URL("/mail", req.url));
};
