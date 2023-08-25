const Model = require('./privacy_policy.model');

/** 
 * add
*/
exports.add =async(reqBody) => {
    return await Model(reqBody).save();
}

/** 
 *Get
*/
exports.get =async() => {
    return await Model.findOne({}).sort({created_at: -1}).lean();
}

/** 
 *update
*/
exports.update =async(id,reqBody) => {
    return await Model.findByIdAndUpdate({ _id: id }, {$set:reqBody}, {new: true}).lean();
}