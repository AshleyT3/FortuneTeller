This is a very simple WebSockets application using socket.io. It is a FortuneTeller app, where you ask a question and the backend chooses a random response. If too much time passes before a question is asked, the fortune teller hints at impatience. 

The frontend UI is small/crude for quickie testing... was just focused on trying out WebSockets for the first time. The backend is Node.js/Express.

Can all run on one machine with steps like the following steps on Windows... 

1. Install Node.js
2. npm install
3. npm run tsc
4. npm run FortuneTeller
5. Browse to localhost:8080

Or, after the above, ZIP and deploy to an Azure app service configured to use Node.js. 
