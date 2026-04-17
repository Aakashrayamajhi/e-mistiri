import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
    {
        sender: {
            type: String,
            
        },
        receiver: {
            type : String,
        },
        content: {
            type: String,
            trim: true,
        },
    //     chat: {
    //    type : string
    //     },
    },
    { timestamps: true }
);

export default mongoose.model('chatModel', chatSchema)