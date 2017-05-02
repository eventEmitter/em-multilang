em-multilang
============

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/em-multilang.svg)](https://greenkeeper.io/)

multilang middleware for ee-webservice


	var   Webservice 	= require( "ee-webservice" )
		, Mutlilang 	= require( "em-multilang" );



	var service = new Webservice( {
		webserver: {
			http: {
				  interface: 	Webservice.Webserver.IF_ANY 
				, port: 		12001
			}
		}
	} );


	service.use( new Mutlilang( {
		  defaultLanguage: 		"en"
		, languages: 			[ "en", "fr", "it", "de" ]
		, externalRedirect: 	false
	} ) );


	service.listen();

