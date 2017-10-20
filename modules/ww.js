var debug = require('debug');
const log = debug('dpc-moments-service-ww');
var rp = require('request-promise');


exports.getSpaces = (jwtToken) => {

	return new Promise(function(resolve, reject){
		log('8.0 getSpaces: in Promise for getSpaces');


		var options = {
		    method: 'POST',
		    uri: 'https://api.watsonwork.ibm.com/graphql',
		    headers: {
		    	'Content-Type':'application/json',
		    	'jwt': jwtToken
		    },
		    body: {
		        query: 'query getSpaces { spaces(first: 20) {items {title id}}}'
		    },
		    json: true // Automatically stringifies the body to JSON
		};
		rp(options)
    .then(function (parsedBody) {
    	log('9.0 getSpaces: in resolve for getSpaces');
        resolve(parsedBody.data.spaces.items);
    })
    .catch(function (err) {

        log('9.0 getSpaces: graphql failed:',err);
        reject(err);
    });
	});
}

exports.getMoments = (jwtToken, id, nbrOfDays) => {
	log('-------> entering getMoments');
	return new Promise(function(resolve, reject){
		log('in Promise for getMoments with id', id);

		var query =
				'query getMomentsInConversation { '
			+ ' conversation(id: "' + id + '") {'
		  + '  moments { '
		  + '    items { '
		  + '      id '
		  + '      live '
		  + '       startTime '
		  + '      endTime '
		  + '      summaryPhrases { '
		  + '        label '
		  + '        score '
		  + '      } '
		  + '    } '
		  + '   } '
		  + '  } '
			+ ' }'
			;
		var options = {
				method: 'POST',
				uri: 'https://api.watsonwork.ibm.com/graphql',
				headers: {
					'Content-Type':'application/json',
					'x-graphql-view':'PUBLIC,BETA',
					'jwt': jwtToken
				},
				body: {
						query: query
				},
				json: true // Automatically stringifies the body to JSON
		};
		rp(options)
		.then(function (parsedBody) {
			log('in resolve for getMoments');
			var moments = [];
			if (parsedBody.data.conversation.moments.items) {
				log('%d items:', parsedBody.data.conversation.moments.items.length);
				for ( var i = 0; i < parsedBody.data.conversation.moments.items.length; i++ ) {
					log(parsedBody.data.conversation.moments.items[i].endTime);
					log(calcDaysAway(parsedBody.data.conversation.moments.items[i].endTime));
					if( calcDaysAway(parsedBody.data.conversation.moments.items[i].endTime) < nbrOfDays ){
						if (parsedBody.data.conversation.moments.items[i].summaryPhrases) {
							for ( var j = 0; j < parsedBody.data.conversation.moments.items[i].summaryPhrases.length; j++) {
								var moment = parsedBody.data.conversation.moments.items[i].summaryPhrases[j];
								moments.push(moment);
							}
						}
					}
				}
			}
				resolve({'nbrOfMoments':moments.length,'moments':moments});
		})
		.catch(function (err) {

				log('9.0 getSpaces: graphql failed:',err);
				reject(err);
		});
	});
	log('<----- exiting getMoments');
}

function calcDaysAway(endTime) {
	var oneDay= 1000 * 60 * 60 * 24; // one day in milliseconds
	var endTimeInMillis = new Date(endTime).getTime();
	var nowInMillis = new Date().getTime();
	var diffInMillis = nowInMillis - endTimeInMillis;
	return Math.round(diffInMillis/oneDay);
}
