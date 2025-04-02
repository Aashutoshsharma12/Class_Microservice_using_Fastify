"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _Custom_message_1 = require("../../Custom_message/index");
const class_1 = __importDefault(require("../../models/class"));
const http_status_codes_1 = require("http-status-codes");
const publisher_1 = require("../../utils/publisher");
const api_call_method_1 = require("../../utils/api_call_method");
const add = async (body, fastify) => {
    try {
        // const { userId, className } = body;
        const add = await class_1.default.create(body);
        // const dataaa = await sendMessage('user_details_order_queue', { _id: add._id })
        return ({ code: http_status_codes_1.StatusCodes.CREATED, data: add });
    }
    catch (err) {
        throw ({ code: http_status_codes_1.StatusCodes.BAD_REQUEST, err: err });
    }
};
const details = async (query, headers) => {
    try {
        const { authorization } = headers;
        const { classId } = query;
        const details = await class_1.default.findOne({ _id: classId });
        if (details) {
            const subject_list = await (0, api_call_method_1.api_call_post_method)("Subject", { classId: classId }, authorization);
            const new_obj = details.toObject();
            new_obj.subject_details = subject_list;
            console.log(subject_list, "subject_list");
            return new_obj;
        }
        else {
            throw ((0, _Custom_message_1.messages)('en').noDatafoundWithID);
        }
    }
    catch (err) {
        throw (err);
    }
};
const delete_class = async (classId) => {
    try {
        const delet1e = await class_1.default.findByIdAndUpdate({ _id: classId }, { isDelete: true }, { new: true });
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
            const body = { classId: delet1e._id, priority: 1 };
            const queueName = 'delayed_queue';
            const routingKey1 = "delayed_key";
            (0, publisher_1.sendMessage_to_using_delayed_queue)(queueName, body, routingKey1);
        }
        return delet1e;
    }
    catch (err) {
        throw err;
    }
};
const list = async (body, headers) => {
    try {
        const { authorization } = headers;
        const list = await class_1.default.find({ isDelete: false });
        if (list.length) {
            const classIds = list.map((cls) => cls._id);
            const subject_list = await (0, api_call_method_1.api_call_post_method)("Subject", { classId: classIds }, authorization);
            const data = list.map((item) => {
                let obj = {
                    ...item.toObject(),
                    // subject_details: {}
                };
                if (subject_list.length) {
                    const check = subject_list.find((item1) => item1.classId.toString() == item._id.toString());
                    if (check) {
                        obj.subject_details = check;
                    }
                    else {
                        obj.subject_details = { "message": "⚠️ Subject details unavailable" };
                    }
                }
                else {
                    obj.subject_details = { "message": "⚠️ Subject details unavailable" };
                }
                return obj;
            });
            return data;
        }
        else {
            return list;
        }
    }
    catch (err) {
        throw err;
    }
};
exports.default = {
    add,
    details,
    list,
    delete_class
};
