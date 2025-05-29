import mongoose from 'mongoose'; 

// Описуємо схему об’єкта Contact
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,        // тип рядок
      required: true,      // обов’язкове поле
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,        // необов’язкове поле
    },
    isFavourite: { 
      type: Boolean,
      default: false,      //значення за замовчуванням 
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],  // лише ці 3 варіанти
      required: true,
      default: 'personal',
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users', //зв’язок із колекцією користувачів
            required: true,
          },
  },
  {
    timestamps: true, // ➕ додає createdAt і updatedAt автоматично
  }
);

// Створюємо модель на основі схеми
export const Contact = mongoose.model('Contact', contactSchema);
