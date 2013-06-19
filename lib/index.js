

	var   Class 	= require( "ee-class" )
		, log 		= require( "ee-log" );


	module.exports = new Class( {


		init: function( options ){
			this.externalRedirect 	= !!options.externalRedirect;
			this.defaultLanguage 	= options.defaultLanguage || "en" ;
			this.languages 			= options.languages  || [] ;
		}


		, request: function( request, response, next ){
			var   header 	= request.getHeader( "accept-language", true )
				, changed 	= false;


			if ( header && header.length > 0 ){
				for ( var i = 0, l = header.length; i < l ; i++ ){
					if ( this.languages.indexOf( header[ i ].key.toLowerCase() ) !== -1 ){
						request.language = header[ i ].key.toLowerCase();
						changed = true;
						break;
					}
				}
			}
			else {
				request.language = this.defaultLanguage;
				changed = true;
			}

			// redirect ?
			if ( changed && this.externalRedirect ){
				var result;

				// check for a language in the url				
				if ( result = /^\/([a-z]{2})(\/?$|\/)/gi.exec( request.pathname ) ){
					if ( result && result.length === 3 && result[ 1 ].toLowerCase() === request.language && result[ 2 ] === "/" ) next();
					else {
						// redirect
						response.send( "", { Location: "/" + request.language + "/" + request.pathname.substr( 4 ) + ( request.querystring ? "?" + request.querystring : "" ) }, 302 );
					}
				}
				else {
					response.send( "", { Location: "/" + request.language + request.pathname + ( request.querystring ? "?" + request.querystring : "" ) }, 302 );
				}
			}
			else next();
		}
	} );