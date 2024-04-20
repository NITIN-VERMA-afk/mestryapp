import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { Message } from "@/models/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 404 }
      );
    }

    if (user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the messages",
        },
        { status: 403 }
      );
    }
    const newMessage = { content, createdAt: new Date() };
    user.message.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message send successfullly",
      },
      { status: 401 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "internal server error",
      },
      { status: 500 }
    );
  }
}
