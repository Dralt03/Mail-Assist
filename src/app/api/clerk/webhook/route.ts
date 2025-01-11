import { db } from "@/server/db";

export const POST = async (req: Request) => {
  const { data } = await req.json();
  const email = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.image_url;

  await db.user.create({
    data: {
      email,
      firstName,
      lastName,
      imageUrl,
    },
  });

  console.log("User Created");
  return new Response("data received", { status: 200 });
};
