const TermsOfUseModel = require('./termsOfUse.model');

/** 
 * add
*/
exports.add =async(reqBody) => {
    return await TermsOfUseModel(reqBody).save();
}

/** 
 *Get
*/
exports.get =async() => {
    return await TermsOfUseModel.findOne({}).sort({created_at: -1}).lean();
}

/** 
 *update
*/
exports.update =async(id,reqBody) => {
    return await TermsOfUseModel.findByIdAndUpdate({ _id: id }, {$set:reqBody}, {new: true}).lean();
}