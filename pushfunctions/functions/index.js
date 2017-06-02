var functions = require('firebase-functions');

var admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.Pushtrigger = functions.database.ref('/notifications/{notificationID}').onWrite((event) => {
    wrotedata = event.data.val();

    admin.database().ref('/users/' + wrotedata.destUser + '/token').once('value').then((token) => {
        var destToken = token.val();

        var payload = {
            "data": {
                "notId": event.data.key,
                "title": "",
                "body": "",
                "questionID": wrotedata.questionID,
                "answerID": wrotedata.answerID,
                "notifType": wrotedata.notifType.toString(),
                "icon": "icon"
            }
        };

        if (wrotedata.notifType == 0) {
            payload.data.title = "SomeSong: New answer added";
            payload.data.body = "Someone sugested an answer to your question";
        }
        else if (wrotedata.notifType == 1) {
            payload.data.title = "SomeSong: Answer marked as correct";
            payload.data.body = "Your Answer was marked as correct, good job!";
        }
        else {
            payload.data.title = "SomeSong: Answer voted up!";
            payload.data.body = "People Voted Up your answer, keep up with the good work!";
        }

        return admin.messaging().sendToDevice(destToken, payload).then((response) => {
            console.log('Pushed Notifications');
        }).catch((err) => {
            console.log(err);
        });
    });
});