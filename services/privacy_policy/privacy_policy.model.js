const mongoose = require("mongoose");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const privacyPolicySchema = new Schema (
    {
        content:{
            type:String,
            default:"",
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

privacyPolicySchema.plugin(softDelete);

const PrivacyPolicy = mongoose.model("privacy_policy", privacyPolicySchema);

module.exports = PrivacyPolicy;