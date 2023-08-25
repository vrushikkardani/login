const mongoose = require("mongoose");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const faqSchema = new Schema (
    {
        question:{
            type:String,
            default:"",
        },
        answer:{
            type:String,
            default:"",
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

faqSchema.plugin(softDelete);

const faq = mongoose.model("faq", faqSchema);

module.exports = faq;