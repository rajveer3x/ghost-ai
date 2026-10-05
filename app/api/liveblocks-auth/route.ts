import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { liveblocks, getUserColor } from "@/lib/liveblocks";
import { checkProjectAccess } from "@/lib/project-access";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { room } = await request.json();

  if (!room) {
    return new NextResponse("Missing room", { status: 400 });
  }

  const access = await checkProjectAccess(room);

  if (!access.hasAccess) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Find the primary email
  const email = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress;

  const userInfo = {
    name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : email || "Anonymous",
    avatar: user.imageUrl || "",
    color: getUserColor(userId),
  };

  try {
    await liveblocks.getRoom(room);
  } catch (err: any) {
    // If the room doesn't exist (usually a 404), create it
    if (err?.status === 404 || err?.message?.includes("not found")) {
      await liveblocks.createRoom(room, {
        defaultAccesses: [], // Ensure explicit access is required
      });
    } else {
      throw err;
    }
  }

  const session = liveblocks.prepareSession(userId, {
    userInfo,
  });

  // Give the user access to the room
  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();

  return new NextResponse(body, { status });
}
