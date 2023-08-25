const Model = require('./rules_regulations.model');

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
    return await Model.find({}).sort({created_at: -1}).lean();
}
/** 
 *Get by id
*/
exports.getById =async(id) => {
    return await Model.findOne({_id:id}).lean();
}


/** 
 *update
*/
exports.update =async(id,reqBody) => {
    return await Model.findByIdAndUpdate({ _id: id }, {$set:reqBody}, {new: true}).lean();
}

/*
*  Delete
*/
exports.delete = async (id) => {

    return await Model.removeOne({_id:id}); 

};
