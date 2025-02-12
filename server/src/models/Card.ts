import mongoose, { Schema, Document } from 'mongoose';

export interface ICard extends Document {
  title: string;
  description: string;
  status: string;
  boardId: string;
}

const cardSchema = new Schema<ICard>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], required: true },
    boardId: { type: String, required: true },
  },
  { versionKey: false },
);

const Card = mongoose.model<ICard>('Card', cardSchema);

export default Card;
