"use strict";
// My first WebSocket app. :) 
Object.defineProperty(exports, "__esModule", { value: true });
var FortuneTeller = /** @class */ (function () {
    function FortuneTeller(connection) {
        var _this = this;
        this.allThereIsToKnow = [
            "Positively so.",
            "Is this the planet earth?",
            "Doubt has run away in great fear, rest assured, it will be.",
            "Of course, of course. And don't forget we accept tips.",
            "Count on it... but remember, no refunds.",
            "Appears to be so.",
            "As certain as it will rain in Seattle.",
            "You'll be fine.",
            "Affirmative capitain.",
            "One second, let me have a sip of my medicine.",
            "Wah? Can't hear ya.",
            "If you say so.",
            "Let's take a raincheck.",
            "I dunno, wadda think?",
            "Look over there while I examine your bag.",
            "Have at it.",
            "Personally, I wouldn't recommend it.",
            "Forgetta 'bout it!",
            "Nah, I don't think so.",
            "Well, I could say yes against my own best judgement."
        ];
        this.impatientComments = [
            "You there, hello?",
            "Forgive my boredom.",
            "<yawn> ... there's a thing called time, and thing a called money...",
            "It's called a question... like you ask me something, and I answer.",
            "Oh yawn, can someone order some java for da customer... hey, you have a question?"
        ];
        this.connection = connection;
        connection.on('customer question', function (question) { return _this.onCustomerQuestion(question); });
        connection.on("disconnect", function () { return _this.onCustomerDisconnect(); });
        console.log('Customer, customer... we have a customer. Places everyone.');
        connection.emit('fortune teller answer', 'Hello there, I sense you are wondering something... do tell.');
        this.startPatientlyWaiting();
    }
    FortuneTeller.prototype.onCustomerQuestion = function (customerQuestion) {
        this.startPatientlyWaiting();
        if (!customerQuestion || customerQuestion.length > 500) {
            this.connection.emit('fortune teller answer', "Goodness you're a strange one.");
            return;
        }
        console.log("Ahhh, so you would like to know \"" + customerQuestion + "\" ... let me see...");
        var theAnswer = this.getAnswer();
        console.log("The answer: " + theAnswer);
        this.connection.emit('fortune teller answer', theAnswer);
    };
    FortuneTeller.prototype.onCustomerDisconnect = function () {
        clearTimeout(this.timerId);
        console.log("The customer left.");
    };
    FortuneTeller.prototype.startPatientlyWaiting = function () {
        var _this = this;
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.timerId = setTimeout(function () { return _this.onPatienceHasRunOut(); }, 10 * 1000);
    };
    FortuneTeller.prototype.onPatienceHasRunOut = function () {
        // Drop a hint...  
        this.connection.emit('fortune teller comment', this.getImpatientComment());
        // ...but remember they're the customer so let's wait patiently again. 
        this.startPatientlyWaiting();
    };
    FortuneTeller.prototype.getAnswer = function () {
        var maxChoice = this.allThereIsToKnow.length;
        var choice = Math.floor(Math.random() * maxChoice);
        return this.allThereIsToKnow[choice];
    };
    FortuneTeller.prototype.getImpatientComment = function () {
        var maxChoice = this.impatientComments.length;
        var choice = Math.floor(Math.random() * maxChoice);
        return this.impatientComments[choice];
    };
    return FortuneTeller;
}());
var portToUse = process.env.PORT || 8080;
var path = require('path');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(portToUse, function () {
    console.log("Listening on port " + portToUse);
});
app.use(express.static(path.join(__dirname, 'pub')));
console.log("Running from " + __dirname);
io.on('connection', function (connection) {
    var fortuneTeller = new FortuneTeller(connection);
});
console.log("Server listening on port " + portToUse);
console.log('The great fortune teller awaits a wise smart person to call for sound advice.');
