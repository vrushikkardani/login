const mongoose = require("mongoose");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const productSchema = new Schema (
    {
        image:{
        type: String,
        required: false,
        default: "",
        },
        product_name:{
            type:String,
            default:"",
        },
        product_price:{
            type:Number,
            default:"",
        },
        product_qty:{
            type:Number,
            default:"",
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

productSchema.plugin(softDelete);

const product = mongoose.model("product", productSchema);

module.exports = product;