const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
let softDelete = require('mongoosejs-soft-delete');
const validator = require('mongoose-validator');

const Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        image:{
            type: String,
            required: false,
            default: ""
        },
        first_name: {
            type: String,
            default: ""
        },
        last_name: {
            type: String,
            default: ""
        },
        email:{
            type:String,
            default: "",
            lowercase: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            default: "",
            required: false
        },
        role: {
            type: String,
            enum: ["admin","user"],
            default:"user",
            required:false,
        },
        otp: {
            type: Number,
            required: false,
            default: 0
        },
        otp_expire_time:{
            type:String,
            default: Date.now()
        },
        fcm_token: {
            type: String,
            required: false,
            default: ""
        },
        device_type: {
            type: String,
            enum: ["android","ios"],
            default:"android",
            required:false
        },
        device_id: {
            type: String,
            required: false,
            default: ""
        },
        is_notification_on: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ["verified","pending","deactivated"],
            default:"pending",
            required:false,
        },
        register_type: {
            type: String,
            enum: ["guest","user"],
            default:"user",
            required:false,
        },
        dob:{
            type:Date,
            required:true,
        },
        coins:{
            type:Number,
            required:false,
            default : 0
        }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

usersSchema.plugin(softDelete);
 

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;

