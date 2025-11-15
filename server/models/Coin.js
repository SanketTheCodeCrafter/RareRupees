import mongoose from 'mongoose';

const coinSchema = new mongoose.Schema(
    {
        frontImage: { type: String, required: true },
        rearImage: { type: String, required: true },
        denomination: { type: String, required: true },
        year: { type: Number, required: true },
        mint: { type: String, required: true },
        condition: { type: Number, required: true },
        mark: { type: String, required: true },
        isSpecial: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model('Coin', coinSchema);
