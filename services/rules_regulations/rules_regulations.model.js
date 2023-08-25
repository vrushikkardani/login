const mongoose = require("mongoose");
let softDelete = require('mongoosejs-soft-delete');

const Schema = mongoose.Schema;

const rulesRegulationsSchema = new Schema (
    {
        game:{
            type:String,
            enum: ["NEPT","WOW","SUPER WOW"],
            required:true,
        },
        rules_regulations:{
            type:String,
            default:"",
        },
        status:{
            type: String,
            enum: ["active","inactive"],
            default:"active",
            required:false,
        }
    },
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

rulesRegulationsSchema.plugin(softDelete);

const RulesRegulations = mongoose.model("rules_regulations", rulesRegulationsSchema);

module.exports = RulesRegulations;