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
    total: Number,

    isPending:Boolean,

}, {
    timestamps: true,
});


const Purchase = model("Purchase", purchaseSchema);
module.exports = Purchase;