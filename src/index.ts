import app from './app.js';
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log('');
  console.log('=== MedSathi Backend Server ===');
  console.log('Running on http://localhost:' + PORT);
  console.log('');
  console.log('Available Routes:');
  console.log('  Auth:        /api/auth/*');
  console.log('  Medicines:   /api/medicines/*');
  console.log('  Scan:        /api/scan');
  console.log('  Community:   /api/community/*');
  console.log('  Experiences: /api/experiences/*');
  console.log('  AI Chat:     /api/chat/*');
  console.log('================================');
});
