import mongoose from 'mongoose';

const menuSchema = mongoose.Schema(
 {   name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    URLmodel : {
        type : String,
        required : true 
    }
},
    {
    collection : "Menu"

    }
);
export default mongoose.model('Menu', menuSchema);