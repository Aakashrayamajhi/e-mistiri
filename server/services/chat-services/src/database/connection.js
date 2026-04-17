import mongoose from 'mongoose';

const dbconnection = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/emistiri-chat');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

export default dbconnection;