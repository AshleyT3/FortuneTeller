// My first WebSocket app. :) 

import { Socket } from "dgram";

class FortuneTeller {

  connection : Socket
  timerId : any;

  constructor(connection : Socket) {   
    this.connection = connection;
    connection.on('customer question', (question : string) => this.onCustomerQuestion(question));  
    connection.on("disconnect", () => this.onCustomerDisconnect()); 
    console.log('Customer, customer... we have a customer. Places everyone.');
    connection.emit('fortune teller answer', 'Hello there, I sense you are wondering something... do tell.');
    this.startPatientlyWaiting();          
  }

  private onCustomerQuestion(customerQuestion : string) {
    this.startPatientlyWaiting();    
    if (!customerQuestion || customerQuestion.length > 500) {
      this.connection.emit('fortune teller answer', "Goodness you're a strange one.");
      return;
    }
    console.log(`Ahhh, so you would like to know "${customerQuestion}" ... let me see...`);
    var theAnswer = this.getAnswer();
    console.log(`The answer: ${theAnswer}`);
    this.connection.emit('fortune teller answer', theAnswer); 
  }

  private onCustomerDisconnect() {
    clearTimeout(this.timerId);
    console.log("The customer left."); 
  }

  private startPatientlyWaiting() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => this.onPatienceHasRunOut(), 10*1000);
  }

  private onPatienceHasRunOut() {
    // Drop a hint...  
    this.connection.emit('fortune teller comment', this.getImpatientComment());
    // ...but remember they're the customer so let's wait patiently again. 
    this.startPatientlyWaiting();
  }

  private getAnswer() : string {
    var maxChoice: number = this.allThereIsToKnow.length;
    var choice: number = Math.floor(Math.random() * maxChoice);  
    return this.allThereIsToKnow[choice];
  }

  private getImpatientComment() : string {
    var maxChoice: number = this.impatientComments.length;
    var choice: number = Math.floor(Math.random() * maxChoice);  
    return this.impatientComments[choice];
  }

  private allThereIsToKnow: string[] = [
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

  private impatientComments: string[] = [
    "You there, hello?",
    "Forgive my boredom.",
    "<yawn> ... there's a thing called time, and thing a called money...",
    "It's called a question... like you ask me something, and I answer.",
    "Oh yawn, can someone order some java for da customer... hey, you have a question?"
  ];
}

const portToUse = process.env.PORT || 8080;

const path = require('path');
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(portToUse, () => {
  console.log("Listening on port " + portToUse);
});
app.use(express.static(path.join(__dirname, 'pub')));

console.log(`Running from ${__dirname}`);

io.on('connection', (connection : Socket) => {
  var fortuneTeller = new FortuneTeller(connection);
});

console.log("Server listening on port " + portToUse);
console.log('The great fortune teller awaits a wise smart person to call for sound advice.');
