import dbConnect from "@/src/lib/dbConnects";
import UserModal from "@/src/models/User";
import {safeParse, success, z} from "zod"
import { usernameValidation } from "@/src/schemas/signUpSchema"


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){

    // // TODO: use this in all other routes   // aisa krna ki jrurat nhi ha alag hi krna hoga POST request ye code purane wala me chalta tha
    // if (request.method !== 'GET') {
    //     return Response.json(
    //             {
    //             success: false,
    //             message: 'Only GET Methods are allowed'
    //             },
    //             { status: 405 }
    //         )
    // }

    await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        console.log("FULL UPL", request.url);
        console.log("USERNAME", searchParams.get('username'));
        
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        // console.log(result)

        if(!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', '): 'Invalid query parameters'
            },
            { status: 400 }
            )
        }

        const {username} = result.data
        const existingVerifiedUser = await UserModal.findOne({ username, isVerified: true})

        if(existingVerifiedUser){
            return Response.json(
                {
                success: false,
                message: 'Username is already taken'
                },
                { status: 400 }
            )
        }

        return Response.json(
                {
                success: true,
                message: 'Username is unique'
                },
                { status: 200 }
            )

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            { status: 500 }
        )
    }
}
