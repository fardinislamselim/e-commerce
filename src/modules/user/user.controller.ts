import catchAsync from "@app/utils/catchAsync.js"
import sendResponse from "@app/utils/sendResponse.js"
import httpStatus from "http-status"

import { userService } from "./user.service.js"

const createUser = catchAsync(async(req, res)=>{
   
const result = await userService.createUser(req.body)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success:true, 
        message:"user create successfully",
        data: {
            result
        }
    })
})









const userController = {
    createUser
}

export default userController