import { messages } from "@Custom_message";
import classModel from "@models/class";
import { StatusCodes } from "http-status-codes";
import { generateToken } from "@utils/authenticate";
import cookieParser from 'cookie-parser';
import { sendMessage, sendMessage_to_priorityBases, sendMessage_to_using_delayed_queue, sendMessage_to_using_Lazy_queue, sendMessage_usingFanout, sendMessage_usingHeaders, sendMessage_usingTopic } from "@utils/publisher";
import { api_call_post_method } from "@utils/api_call_method";

const add = async (body: any, fastify: any) => {
    try {
        // const { userId, className } = body;
        const add = await classModel.create(body);
        // const dataaa = await sendMessage('user_details_order_queue', { _id: add._id })
        return ({ code: StatusCodes.CREATED, data: add });
    } catch (err) {
        throw ({ code: StatusCodes.BAD_REQUEST, err: err });
    }
}

const details = async (query: any, headers: any) => {
    try {
        const { authorization } = headers;
        const { classId } = query;
        const details: any = await classModel.findOne({ _id: classId });
        if (details) {
            const subject_list = await api_call_post_method("Subject", { classId: classId }, authorization);
            const new_obj = details.toObject();
            new_obj.subject_details = subject_list
            console.log(subject_list, "subject_list");
            return new_obj
        } else {
            throw (messages('en').noDatafoundWithID);
        }
    } catch (err) {
        throw (err);
    }
}
const delete_class = async (classId: any) => {
    try {
        const delet1e = await classModel.findByIdAndUpdate({ _id: classId }, { isDelete: true }, { new: true });
        if (delet1e) {
            /**
             * Direct queue
             */
            // const queueName = 'delete_class_subject_queue';
            // const queueName1 = 'delete_class_user_queue';
            // const routingKey = "class_notification_toUser"
            // const routingKey1 = "class_notification_toSubj"
            // sendMessage(queueName, delet1e._id, routingKey);
            // sendMessage(queueName1, delet1e._id, routingKey1);

            /** 
             * Send message using Topic
             */
            // const routingKey = "class.notification.toUser.push"
            // const routingKey1 = "subj.push"
            // sendMessage_usingTopic(delet1e._id, routingKey)
            // sendMessage_usingTopic(delet1e._id, routingKey1)

            /** 
           * Send message using fanout
           */
            // sendMessage_usingFanout(delet1e._id)

            /**
             * Send Message Using Headers
             */
            // const body = { classId: delet1e._id, priority: 1 }
            // const headers = {
            //     "x-match": 'all',
            //     "notification-type": "class_notification_to_subject",
            //     "content-type": "notification"
            // }
            // const headers1 = {
            //     "x-match": 'all',
            //     "notification-type": "class_notification_toUser",
            //     "content-type": "notification"
            // }
            // sendMessage_usingHeaders(body, headers);
            // sendMessage_usingHeaders(body, headers1);

            /**
             * Periority Base messages
             */
            // const body = { classId: delet1e._id, priority: 1 }
            // const queueName = 'delete_class_subject_queue1';
            // const routingKey1 = "class_notification_toSubj1"
            // sendMessage_to_priorityBases(queueName, body, routingKey1);

            /**
             * Lazy Queue
             */
            // const body = { classId: delet1e._id, priority: 1 }
            // const queueName = 'delete_class_subject_queue12121';
            // const routingKey1 = "class_notification_toSubj121"
            // sendMessage_to_using_Lazy_queue(queueName, body, routingKey1)

            /**
             * Delay Queue
             */
            const body = { classId: delet1e._id, priority: 1 }
            const queueName = 'delayed_queue';
            const routingKey1 = "delayed_key"
            sendMessage_to_using_delayed_queue(queueName, body, routingKey1)

        }
        return delet1e;
    } catch (err) {
        throw err;
    }
}

const list = async (body: any, headers: any) => {
    try {
        const { authorization } = headers
        const list = await classModel.find({ isDelete: false });
        if (list.length) {
            const classIds = list.map((cls) => cls._id);
            const subject_list = await api_call_post_method("Subject", { classId: classIds }, authorization);
            const data = list.map((item: any) => {
                let obj = {
                    ...item.toObject(),
                    // subject_details: {}
                }
                if (subject_list.length) {
                    const check = subject_list.find((item1: any) => item1.classId.toString() == item._id.toString());
                    if (check) {
                        obj.subject_details = check
                    } else {
                        obj.subject_details = { "message": "⚠️ Subject details unavailable" }
                    }
                } else {
                    obj.subject_details = { "message": "⚠️ Subject details unavailable" }
                }
                return obj;
            })
            return data
        } else {
            return list
        }
    } catch (err) {
        throw err;
    }
}

export default {
    add,
    details,
    list,
    delete_class
} as const;