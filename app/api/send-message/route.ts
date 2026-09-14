import dbConnect from "@/src/lib/dbConnects";
import UserModal from "@/src/models/User";
import {Message} from "@/src/models/User"

export async function POST(request: Request){
    await dbConnect()

    const {username, content} = await request.json()

    try {
        const user = await UserModal.findOne({username})

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
                )
        }

        // is user accepting the message
        if(!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not accepting the messages"
                },
                { status: 403 }
                )
        }

        const newMessage = {content, createdAt: new Date()}
        user.message.push(newMessage as Message)
        await user.save()

        return Response.json(
                {
                    success: true,
                    message: "message sent successfully"
                },
                { status: 401 }
                )

    } catch (error) {
        console.error("Error adding messages", error)
        return Response.json(
            {
                success: false,
                message: "Internal server error"
            },
            { status: 500 }
        )
    }
}