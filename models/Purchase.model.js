const {
    Schema,
    model
} = require("mongoose");

const purchaseSchema = new Schema({
    product: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    total: {
        type: Number,
        default: 0
    },
    isPending: {
        type:Boolean,
        default:true
    },
    isOpen: {
        type:Boolean,
        default:true
    }
}, {
    timestamps: true,
});


const Purchase = model("Purchase", purchaseSchema);
module.exports = Purchase;