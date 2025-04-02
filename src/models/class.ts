import { model, Schema } from "mongoose";

interface class1 {
    className: string;
    isDelete: boolean;
    isActive: boolean;
}

const schema = new Schema<class1>({
    className: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
},
    {
        timestamps: true
    });
const classModel = model<class1>('class', schema);
export = classModel;