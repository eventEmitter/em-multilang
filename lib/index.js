

	var   Class 	= require( "ee-class" )
		, log 		= require( "ee-log" );
		//, geoip 	= require( "geoip-lite" );


	module.exports = new Class( {


		init: function( options ){
			options = options || {};

			this.externalRedirect 			= !!options.externalRedirect;
			this.defaultLanguage 			= options.defaultLanguage || "en" ;
			this.countryDefaultLanguages 	= options.countries || {};
			this.languages 					= options.languages  || [] ;
		}


		
		, request: function( request, response, next ){
			var   accept 		= request.getHeader('accept') || ''
				, isHtml 		= accept.indexOf('/html') >= 0 || accept === '*/*'
				, changed 		= false
				, header
				, result;
			

			// dont rediret non html requests
			if (!isHtml) return next();


			// check for the language in the cookie, this overrides everything else
			header = request.getHeader('cookie');
			if (header) {
				if (result = /lang=([a-z]{2})\s?;/gi.exec(header)) {
					request.language = result[1].toLowerCase();
					changed = true;
				}
			}

			// check for language in url
			if (!changed && request.pathname.length >= 3 && request.pathname[0] === '/' && this.languages.indexOf(request.pathname.substr(1, 2).toLowerCase()) >= 0 && ((request.pathname.length > 3 && request.pathname[3] === '/' ) || true)) {
				request.language = request.pathname.substr(1, 2).toLowerCase();
				changed = true;
			}

			// check if we're supporting any language provided in the language header.
			header = request.getHeader('accept-language', true );
			if (!changed && header && header.length > 0 ) {
				for ( var i = 0, l = header.length; i < l ; i++ ){
					if ( this.languages.indexOf( header[ i ].key.toLowerCase() ) !== -1 ){
						request.language = header[ i ].key.toLowerCase();
						changed = true;
						break;
					}
				}
			}

			// default language
			if (!changed) {
				request.language = this.defaultLanguage;
				changed = true;
			}

			// redirect ?
			if (changed && this.externalRedirect) {

				// check for a language in the url				
				if (result = /^\/([a-z]{2})(\/?$|\/)/gi.exec(request.pathname)) {

					// is the language already set?
					if (result && result.length === 3 && result[1].toLowerCase() === request.language && result[2] === '/') {
						request.pathname = request.pathname.substr(3);
						next();
					}
					else {
						// redirect
						response.send('', {Location: '/' + request.language + '/' + request.pathname.substr(4) + (request.querystring ? '?' + request.querystring : "")}, 302);
					}
				}
				else {
					response.send('', {Location: '/' + request.language + request.pathname + (request.querystring ? '?' + request.querystring : '')}, 302);
				}
			}
			else next();
		}
	});