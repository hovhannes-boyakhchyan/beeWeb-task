module.exports = (app) => {
    app.use('/user', require('./routers/users'));
    app.use('/workspace', require('./routers/workspace'));
    app.use('/auth', require('./routers/auth'));
    app.use('/upload', require('./routers/upload'));
}