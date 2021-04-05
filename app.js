var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const { Op } = require("sequelize");

const sequelize = require('./sequelize');
const { User, RateLimit } = require('./models');
var indexRouter = require('./routes/index');
const config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.enable('trust proxy');

app.use(function(req, res, next) {
    (async () => {
        let rateLimit = await RateLimit.findOne({
            where: {
                ip: req.ip,
                time: {
                    [Op.lt]: new Date(),
                    [Op.gt]: new Date(new Date() - config.rateLimitInterval * 60 * 60 * 1000)
                }
            }
        });
        if (rateLimit) {
            console.log(JSON.stringify(rateLimit));
            if (rateLimit.count >= config.rateLimitCount) {
                next(createError(429));
            }
            else {
                // count add one
                await rateLimit.update({ count: rateLimit.count + 1 })
                    .then(function() { console.log('ip limit update completed'); });
                
                const resetTimeUTC = new Date().getTime() / 1000;
                res.set({
                    'X-RateLimit-Remaining': config.rateLimitCount - rateLimit.count,
                    'X-RateLimit-Reset': Math.round(resetTimeUTC + 60 * 60)
                });
                next();
            }
            
        }
        else {
            const newRateLimit = await RateLimit.create({ 
                ip: req.ip, 
                time: new Date(),
                count: 1
            })
                .then(function() { console.log("created"); });
            
            const resetTimeUTC = new Date().getTime() / 1000;
            res.set({
                'X-RateLimit-Remaining': config.rateLimitCount - 1,
                'X-RateLimit-Reset': Math.round(resetTimeUTC + 60 * 60)
            });
            next();
        } 
    })();
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
