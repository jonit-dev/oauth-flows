class OAuth {

    static init() {

        //Own server variables
        this.OWN_SERVER_AUTH_SCRIPT = 'XXXX';

        //Google credentials
        this.OAUTH_GOOGLE_CLIENT_ID = 'XXXX'; //has to be the same as our auth script above

        this.OAUTH_IMPLICIT_GOOGLE_REDIRECT_URI = 'XXXX';
        this.OAUTH_AUTH_CODE_GOOGLE_REDIRECT_URI = `XXXX`;

        //Facebook credentials
        this.OAUTH_FACEBOOK_CLIENT_ID = 'XXXX';
        this.OAUTH_IMPLICIT_FACEBOOK_REDIRECT_URI = 'XXXX';
        this.OAUTH_AUTH_CODE_FACEBOOK_REDIRECT_URI = ``; //didnt have time to do this one




    }

    static getQueryParams(qs) {
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }


    static getCodePermissions(provider, type = 'token', redirectUri) {

        switch (provider) {

            case 'google':

                document.location.href = [`https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.OAUTH_GOOGLE_CLIENT_ID}`,
                    `redirect_uri=${redirectUri}`,
                    `response_type=${type}`,
                    `scope=openid profile email`].join('&');
                break;


            case 'facebook':

                document.location.href = [`https://www.facebook.com/v3.2/dialog/oauth?client_id=${this.OAUTH_FACEBOOK_CLIENT_ID}`,
                    `redirect_uri=${redirectUri}`,
                    `response_type=${type}`,
                    `scope=email,public_profile`].join('&');

                break;
        }
    }

    static getAccessTokenOrCode() {

        if (document.location.href.indexOf('code=') > -1) {

            let urlData = document.location.href.split("?");
            let paramsString = urlData[1];

            let params = OAuth.getQueryParams(paramsString);

            console.log(params);

            return {
                code: params.code,
                provider: params.scope !== undefined ? 'google' : 'facebook' //here it checks if we're deadling with google or facebook. What makes google requests distinctive is that its the only one that has a 'scope' parameter. Facebook doesn't
            };

        }


        if (document.location.href.indexOf('access_token') > -1) {
            let urlData = document.location.href.split("#");
            let paramsString = urlData[1];

            let params = OAuth.getQueryParams(paramsString);

            // console.log(params);


            return {
                access_token: params.access_token,
                provider: params.scope !== undefined ? 'google' : 'facebook' //here it checks if we're deadling with google or facebook. What makes google requests distinctive is that its the only one that has a 'scope' parameter. Facebook doesn't
            };
        }

    }


    static getUserData(flow, authorization_server, tokenOrCode) {

        switch (flow) {

            case 'authorization-code-grant':

                //lets fetch the access token from our own server!

                $.ajax({
                    type: 'GET',
                    url: `${this.OWN_SERVER_AUTH_SCRIPT}?${tokenOrCode}`,
                    dataType: 'json',
                    success: function (data, status) {

                        console.log(data);

                        let access_token = data.access_token;

                        // now we can get the userinfo
                        console.log("got access_token from our OWN server (Authorization code flow)");

                        console.log('Fetching user info...');

                        //do a request to google, using received access token, to get user information
                        $.ajax({
                            type: 'GET',
                            url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
                            dataType: 'json',
                            headers: {
                                "Authorization": `Bearer ${access_token}`
                            },
                            success: function (data, status) {
                                console.log(data);
                            },
                            error: function (req, errorType, errorMsg) {
                                console.log('Failed fetching user info from google:' + errorType + ' - ' + errorMsg)
                            }
                        });


                    },
                    error: function (req, errorType, errorMsg) {
                        console.log('Failed on fetch our own server data:' + errorType + ' - ' + errorMsg)
                    }
                });


                break;


            case 'implicit':

                let fetchUrl; //where to get user info from

                switch (authorization_server) {

                    case 'google':
                        fetchUrl = 'https://www.googleapis.com/userinfo/v2/me?fields=email%2Cfamily_name%2Cgender%2Cgiven_name%2Chd%2Cid%2Clink%2Clocale%2Cname%2Cpicture%2Cverified_email';
                        break;
                    case 'facebook':
                        fetchUrl = 'https://graph.facebook.com/v3.2/me?fields=name,email,picture';
                        break;
                }

                console.log(`Got token from ${authorization_server}`);


                //do request to get users info
                $.ajax({
                    type: 'GET',
                    url: fetchUrl,
                    dataType: 'json',
                    headers: {
                        "Authorization": `Bearer ${tokenOrCode}`
                    },
                    success: function (data, status) {
                        console.log(data);
                    },
                    error: function (req, errorType, errorMsg) {
                        console.log('Ajax Call Error type:' + errorType + ' - ' + errorMsg)
                    }
                });


                break;


        }


    }


}