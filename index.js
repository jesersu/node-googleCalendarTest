const { google } = require('googleapis')
const { OAuth2 } = google.auth
const oAuth2Client = new OAuth2('', '')

oAuth2Client.setCredentials({
    refresh_token: '',

})

const calendar = google.calendar({
    version: 'v3',
    auth: oAuth2Client
})

const eventStartTime = new Date()
eventStartTime.setDate(eventStartTime.getDay() + 2)

const eventEndTime = new Date()
eventEndTime.setDate(eventEndTime.getDay() + 2)
eventEndTime.setMinutes(eventEndTime.getMinutes() + 45)

const event = {
    summary: 'Reu con Cahui',
    location: 'Calle Francisco Bolognesi 112, Cerro Colorado 04000',
    description: 'Reunion de superacionm asdfasdfasdfasdfasdfasdfasdfasfsdfsafsadfasdfsadfasdfasdfasdfsadfsadfasdfsdafasdfsadf',
    start: {
        dateTime: eventStartTime,//'2021-11-28T09:00:00-07:00',
        timeZone: 'America/Lima',
    },
    end: {
        dateTime: eventEndTime,//'2021-11-28T09:00:00-07:30',
        timeZone: 'America/Lima',
    },
    colorId: 2,
    attendees: [
        { 'email': 'motovic15@gmail.com' },
        { 'email': 'jchapis@unsa.edu.pe' },

    ],
    reminders: {
        'useDefault': false,
        'overrides': [
            { 'method': 'email', 'minutes': 5 },
            { 'method': 'popup', 'minutes': 5 },
        ],
    },

}
/* calendar.events.insert({
    calendarId: 'primary',
    resource: event,
}, function (err, event) {
    if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
    }
    console.log('Event created: %s', event.htmlLink);
}); */

calendar.freebusy.query(
    {
        resource: {
            timeMin: eventStartTime,
            timeMax: eventEndTime,
            timeZone: 'America/Lima',
            items: [{ id: 'primary' }],
        },
    },
    (err, res) => {

        if (err) return console.error('Free Busy Query Error: ', err)
        const eventArr = res.data.calendars.primary.busy
        if (eventArr.length === 0) {

            return calendar.events.insert({
                calendarId: 'primary',
                resource: event
            },
                function (err, event) {
                    if (err) {
                        console.log('There was an error contacting the Calendar service: ' + err);
                        return;
                    }
                    console.log('Event created: %s', event.data.htmlLink);

                    var eventPatch = {
                        conferenceData: {
                            createRequest: { requestId: "7qxalsvy0e" }
                        }
                    };
                    // var eventCreado = google.calendar.events.get({ "calendarId": 'primary', "eventId": event.data.id });

                    calendar.events.patch({
                        calendarId: "primary",
                        eventId: event.data.id,
                        resource: eventPatch,
                        sendNotifications: true,
                        conferenceDataVersion: 1
                    }, function (err, eventr) {
                        if (err) {
                            console.log('There was an error contacting the Calendar service: ' + err);
                            return;
                        }
                        console.log('Event created: %s', eventr.data.hangoutLink);

                    })
                })
        }
        return console.log(`Sorry I'm busy...`)
    }
)

/* var eventPatch = {
    conferenceData: {
        createRequest: { requestId: "7qxalsvy0e" }
    }
};

google.client.calendar.events.patch({
    calendarId: "primary",
    eventId: "7cbh8rpc10lrc0ckih9tafss99",
    resource: eventPatch,
    sendNotifications: true,
    conferenceDataVersion: 1
}).execute(function (event) {
    console.log("Conference created for event: %s", event.htmlLink);
}); */

