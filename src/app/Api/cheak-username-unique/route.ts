import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";

import { usernameValidation } from "@/Schemas/signUpSchema";


const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);

    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(",")
              : "invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: true,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error cheaking username", error);

    return Response.json(
      {
        Success: false,
        Message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
