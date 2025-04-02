"use strict";
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    className: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
});
const classModel = (0, mongoose_1.model)('class', schema);
module.exports = classModel;
