const passport = require("passport");
const adminService = require('./admin.services');
const { usersServices } = require('../users');
const guard = require("../../helper/guards");
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");


module.exports = {

    /*
    *  Login Admin
    */
    login: async (req, res, next) => {
        try{
            passport.authenticate("admin", async function (err, user, info) {
                if (err) {
                    var err = err;
                    err.status = 400;
                    return next(err);
                }
                if (info) {
                    var err = new Error("Missing_Credentials");
                    err.status = 400;
                    return next(err);
                }
                if (user) {
                    let userResponse = await adminService.get(user.id);
                    const token = await guard.createToken(user, userResponse.role);
                    userResponse.token = token.token;
                    return commonResponse.success(res, "LOGIN_SUCCESS", 200, userResponse);
                } else {
                    return commonResponse.customResponse(res, "ADMIN_NOT_FOUND", 400, {}, "Admin not found");
                }
            })(req, res, next);
        } catch (error) {
            console.log("Create User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    
    /*
    *  Change User Status
    */
    changeUserStatus: async (req, res, next) => {
        try {
            let updatedUser = await usersServices.update(req.params.id, req.body);
            if(updatedUser){
                return commonResponse.success(res, "UPDATE_USER_STATUS", 200, updatedUser, "Success");
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong please try again");
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },
    
    /*
    *  Dashboard Counts
    */
    dashboard: async (req, res, next) => {
        try {
            let counts = await adminService.dashboardCounts();
            if(counts){
                return commonResponse.success(res, "DASHBOARD_COUNTS", 200, counts, "Success");
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong please try again");
            }
        } catch (error) {
            console.log("Error : ",error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    * Delete User By Id
    */
    delete:async(req,res,next) =>{
        try {
            let getUser = await adminService.get(req.params.id)
            if(getUser){
                    let deleteUser = await adminService.delete(getUser._id);
                    if(deleteUser){
                        return commonResponse.success(res, "USER_DELETE", 200, deleteUser, 'Success');
                    }else{
                        return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, 'Something went wrong, Please try again');
                    }
               
            }else{
                return commonResponse.customResponse(res, "USER_NOT_FOUND", 400, {}, 'User not found');
            }

            
        } catch (error) {
            console.log("Delete User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

}