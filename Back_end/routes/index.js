module.exports = (app) => {
  app.use('/auth', require('./auth'));
  app.use('/signup', require('./userRouter'));
  app.use('/upload', require('./upload'));
  app.use('/update', require('./update'));
  app.use('/create-exam', require('./creat-exam'));
  app.use('/exams', require('./exam'));
  app.use('/students', require('./student'));
};
