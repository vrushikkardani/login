const passport = require("passport");
const Service = require('./users.services');
const guard = require("../../helper/guards");
const _ = require('lodash');
const moment = require('moment');
const { commonResponse, commonFunctions, nodemailer } = require("../../helper");

module.exports = {

    /*
    *  Register New User
    */
    register: async (req, res, next) => {
        try {

            if (req.files != undefined && req.files.image != undefined) {
                req.body.image = process.env.DOMAIN_URL + "/user-profile/" + req.files.image[0].filename;
            }
            req.body.dob = moment(req.body.dob,'DD/MM/YYYY').format("YYYY-MM-DD");

            req.body.password = await commonFunctions.encryptStringCrypt( req.body.password );
            //req.body.otp = await commonFunctions.randomFourDigit();
            req.body.otp = "1234";
            let isNumberExist = await Service.checkQuery({email: req.body.email});
            
            if (isNumberExist) {
                if(isNumberExist.register_type && isNumberExist.register_type == 'guest'){
                    req.body.register_type = 'user';
                    let updatedUser = await Service.update(isNumberExist._id, req.body);
                    return commonResponse.success(res, "USER_CREATED", 200, updatedUser, 'We have sent account verification OTP to your phone number, Please verify your account to continue');
                }else{
                    return next(new Error("EMAIL_EXIST"));
                }
            } 
            req.body.otp_expire_time = Date.now();
            let user = await Service.save(req.body);
            if(user){
                 /* Send Account Verification Link */
                 let emailData = {
                    to: user.email,
                    subject: "WOW || Account Verification OTP",
                    text: `Your account verification Link Is ${user.otp}`,
                    html: `<h1> WOW </h1> <p>Your account verification OTP is :  ${user.otp}</b></p>`,
                 };
                nodemailer.sendMail(emailData);
                let getUser = await Service.get(user._id);
               return commonResponse.success(res, "USER_CREATED", 200, getUser, 'We have sent account verification OTP to your phone number, Please verify your account to continue');
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, user, 'Something went wrong, Please try again');
            }
        } catch (error) {
            console.log("Create User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    }, 
    
    /*
    *  Login
    */
    login: async (req, res, next) => {
        try {
            passport.authenticate("user", async function (err, user, info) {
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
                    if(user.status == 'pending'){
                        return commonResponse.customResponse(res, "USER_NOT_VERIFIED", 400, user, "Please verify your phone number to login");
                    }
                    if(user.status == 'deactivated'){
                        return commonResponse.customResponse(res, "USER_DEACTIVATED", 400, user, "Your account has been deactivated, Please contact admin to activate your account");
                    }
                    // await Service.update(user._id, {
                    //     fcm_token: req.body.fcm_token ? req.body.fcm_token : "",
                    //     device_type: req.body.device_type ? req.body.device_type : "android",
                    //     device_id: req.body.device_id ? req.body.device_id : "",
                    // })
                    let userResponse = await Service.get(user.id);
                    const token = await guard.createToken(user, userResponse.role);
                    userResponse.token = token.token;
                    return commonResponse.success(res, "LOGIN_SUCCESS", 200, userResponse);
                } else {
                    return commonResponse.customResponse(res, "USER_NOT_FOUND", 400, {}, "User not found");
                }
            })(req, res, next);
        } catch (error) {
            console.log("Login User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Resend Verification OTP
    */
    resendVerificationOTP: async (req, res, next) => {
        try {
            let user = await Service.checkQuery({email: req.body.email});
            if (user) {
                /* Generate Random 6 digit OTP */
                // let otp = await commonFunctions.randomFourDigit();
                let otp = "1234";
                let updateData = {
                    otp: otp,
                    otp_expire_time:Date.now()
                };
                let updateUser = await Service.update( user._id, updateData );
                if(updateUser){
                    /* Send Account Verification OTP */
                    //await sms.sendOTP(updateUser); //uncomment after live
                    let emailData = {
                        to: updateUser.email,
                        subject: "WOW || Account Verification OTP",
                        text: `Your account verification Link Is ${updateUser.otp}`,
                        html: `<h1> WOW </h1>
                                <p>Your account verification OTP is :  ${updateUser.otp}</b></p>`,
                    };
                    return commonResponse.success(res, "RESEND_VERIFICATION_LINK_SUCCESS", 200, updateUser, 'We have sent account verification OTP to your phone number, Please verify your account to continue');
                }else{
                    return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong please try again");
                }
            } else {
                return commonResponse.customResponse(res, "NUMBER_NOT_EXIST", 400, {}, "Number does not exist");
            }
        } catch (error) {
            console.log("Login User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Verify User
    */
    verifyUser: async (req, res, next) => {
        try {
            let getUser = await Service.checkQuery({email: req.body.email});
            if(getUser){
                
                if(getUser.status == 'deactivated'){
                    return commonResponse.customResponse(res, "USER_DEACTIVATED", 400, getUser, "Your account has been deactivated, Please contact admin to activate your account");
                }              
                if(req.body.otp != getUser.otp || req.body.otp == 0 || req.body.otp == '0'){
                    return commonResponse.customResponse(res, "INVALID_OTP", 400, getUser, "Please enter valid otp");
                }
                if(getUser.otp_expire_time && getUser.otp_expire_time != ''){
                    if(Date.now() - getUser.otp_expire_time >= 2*60*1000){
                        return commonResponse.customResponse(res, "OTP_EXPIRED", 400, {}, "Your verification otp is expired, please try to resend verification code ");
                    }
                }
             
                let updateData = {
                    status: 'verified',
                    otp: 0 ,
                };

                let updateUserDetails = await Service.update( getUser._id, updateData );
                if(updateUserDetails){
                    const token = await guard.createToken(updateUserDetails, "user");
                    updateUserDetails.token = token.token;
                    return commonResponse.success(res, "USER_VERIFIED_SUCCESS", 200, updateUserDetails, 'Success');
                }else{
                    return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong please try again");
                }
            }else{
                return commonResponse.customResponse(res, "EMAIL_NOT_EXIST", 400, {}, "Email does not exist");
            }
        } catch (error) {
            console.log("Login User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Forgot Password
    */
    forgotPassword: async (req, res, next) => {
        try {             
            req.body.email = req.body.email.toLowerCase();

            let checkUserExist = await Service.checkQuery(req.body);
            if (checkUserExist) {

                if(checkUserExist.status == 'deactivated'){
                    return commonResponse.customResponse(res, "USER_DEACTIVATED", 400, checkUserExist, "Your account has been deactivated, Please contact admin to activate your account");
                }
                //let otp = await commonFunctions.randomFourDigit();
                let otp = "1234";
                let updateData = {
                    otp: otp,
                    otp_expire_time:Date.now()
                };
                let updateUser = await Service.update( checkUserExist._id, updateData );
                /* Send Reset Password OTP */
                let link = FRONT_LINK +'resetPassword?token='+otp;
                let emailData = {
                    to: updateUser.email,
                    subject: "WOW || Reset Password link",
                    text: `Your Reset Password Link Is ${link}`,
                    html: `<h1> WOW </h1>
                            <p>Your Reset Password verification link is <br><br><a href="${link}" target="_blank" >Click here</a></p>`,
                };
                nodemailer.sendMail(emailData);
            
                return commonResponse.success(res, "FORGOT_PASSWORD_SUCCESS", 200, updateUser, 'We have send reset password OTP to your phone number');
            } else {
                return commonResponse.customResponse(res, "EMAIL_NOT_EXIST", 400, {}, "Email does not exist");
            }
        } catch (error) {
            console.log("Login User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Reset Password
    */
    resetPassword: async (req, res, next) => {
        try {
            let user = await Service.get(req.body.id);
            if(user){
                if(user.status == 'pending'){
                    return commonResponse.customResponse(res, "USER_NOT_VERIFIED", 400, user, "Please verify your phone number");
                }
                if(user.status == 'deactivated'){
                    return commonResponse.customResponse(res, "USER_DEACTIVATED", 400, user, "Your account has been deactivated, Please contact admin to activate your account");
                }
                if (req.body.new_password == req.body.confirm_password) {
                    req.body.new_password = await commonFunctions.encryptStringCrypt( req.body.new_password );
                    let updateData = {
                        password: req.body.new_password,
                    };
                    let updateUserDetails = await Service.update( user._id, updateData );
                    if(updateUserDetails){
                        return commonResponse.success(res, "PASSWORD_RESET_SUCCESS", 200, updateUserDetails, 'Password reset successfully');
                    }else{
                        return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong please try again");
                    }
                }else{
                    return commonResponse.customResponse(res, "INVALID_CONFIRM_PASSWORD", 400, {}, "Confirm password did not match, Please try again");
                }
            }else{
                return commonResponse.customResponse(res, "USER_NOT_FOUND", 400, {}, "User not found");
            }
        } catch (error) {
            console.log("Login User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Update Profile
    */
    update: async (req, res, next) => {
        try {
            if (req.files != undefined && req.files.image != undefined) {
                req.body.image = process.env.DOMAIN_URL + "/user-profile/" + req.files.image[0].filename;
            }
            let updatedUser = await Service.update(req.user.id, req.body);
            if(updatedUser){
                commonResponse.success(res, "USER_PROFILE_UPDATE", 200, updatedUser);
            }else{
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong please try again");
            }
        } catch (error) {
            console.log("Login User -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Change Password
    */
    changePassword: async (req, res, next) => {
        try {
            let getUser = await Service.get(req.user.id);
            if(getUser){
                let isPasswordValid = await commonFunctions.matchPassword(
                    req.body.old_password,
                    getUser.password
                );
                if (isPasswordValid) {
                    if (req.body.new_password == req.body.confirm_password) {
                        req.body.new_password = await commonFunctions.encryptStringCrypt(
                            req.body.new_password
                        );
                        let updateData = {
                            password: req.body.new_password,
                        };
                        let updatePassword = await Service.update(req.user.id, updateData);
                        if (updatePassword) {
                            return commonResponse.success(res, "PASSWORD_CHANGED_SUCCESS", 200, updatePassword, 'Password changed successfully');
                        } else {
                            return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong please try again");
                        }
                    } else {
                        return commonResponse.customResponse(res, "INVALID_CONFIRM_PASSWORD", 400, {}, "Confirm password did not match, Please try again");
                    }
                }else{
                    return commonResponse.customResponse(res, "INVALID_OLD_PASSWORD", 400, {}, "Invalid old password");
                }
            }else{
                return commonResponse.customResponse(res, "USER_NOT_FOUND", 400, {}, "User not found");
            }
        } catch (error) {
            console.log("User Change Password -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  Get Profile
    */
    get: async (req, res, next) => {
        try {
            let user = await Service.get(req.user.id);
            if(user){
                return commonResponse.success(res, "GET_PROFILE", 200, user, "Success");
            }else{
                return commonResponse.customResponse(res, "USER_NOT_FOUND", 400, {}, "User not found");
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    
    /*
    *  Get Profile
    */
    getUser: async (req, res, next) => {
        try {
            let user = await Service.get(req.params.id);
            if(user){
                return commonResponse.success(res, "USER_PROFILE", 200, user, "Success");
            }else{
                return commonResponse.customResponse(res, "USER_NOT_FOUND", 400, {}, "User not found");
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    /*
    *  logout
    */
    logout: async (req, res, next) => {
        try {
            let updateData = {
                fcm_token: '',
                device_id: ''
            };
            let update = await Service.update(req.user.id, updateData);
            if (update) {
                return commonResponse.success(res, "USER_LOGOUT", 200, update, 'Successfully logout');
            } else {
                return commonResponse.customResponse(res, "SERVER_ERROR", 400, {}, "Something went wrong please try again");
            }
        } catch (error) {
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    
    /*
    *List users
    */
    userList:async(req,res,next) => {
        try {
            let query = {};
            if(req.body.type && req.body.type){
                query.role = req.body.type;
            }
            
            let list = await Service.list(query);
            if(list.length > 0){
                return commonResponse.success(res, "USER_LIST", 200, list, 'Success');
            }else{
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No data found');
            }
        } catch (error) {
            console.log("List Users -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

    contactUs:async(req,res,next) => {
        try {
            let user = await Service.get(req.user.id);
            console.log(user);
            let emailData = {
                to: 'cbhavesh008@gmail.com',
                subject: "WOW || "+req.body.subject,
                text: `${user.first_name} ${user.last_name} has contact you`,
                html: `<h1> WOW </h1>
                        <p>Your Reset Password verification link is <br><br><a href="${req.body.message}" target="_blank" >Click here</a></p>`,
            };
            let mail = nodemailer.sendMail(emailData);
            if(mail){
                return commonResponse.success(res, "CONTACT_US", 200, {}, 'Success');
            }else{
                return commonResponse.success(res, "NO_DATA_FOUND", 200, [], 'No data found');
            }
        } catch (error) {
            console.log("Contact us -> ", error);
            return commonResponse.CustomError(res, "DEFAULT_INTERNAL_SERVER_ERROR", 500, {},error.message);
        }
    },

};
