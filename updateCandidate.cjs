// Используем require вместо import
const { connectDB } = require('./src/lib/db.js');  // Указываем расширение .js
const Candidate = require('./src/models/Candidate.js');  // Указываем расширение .js

const updateCandidatesPrivateStatus = async () => {
  try {
    await connectDB();

    const result = await Candidate.updateMany(
      {}, 
      { $set: { private: false } }
    );

    console.log('Обновление прошло успешно:', result);
  } catch (error) {
    console.error('Ошибка при обновлении кандидатов:', error);
  }
};

updateCandidatesPrivateStatus();
