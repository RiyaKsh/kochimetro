const mongoose = require('mongoose');

const mongo_url = process.env.MONGO_CONN || 'mongodb://localhost:27017/compliance-management';

mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB Connected...');
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
});
