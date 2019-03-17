$(function () {


    //First, setup your app credentials on OAuth Init
    OAuth.init();

    /*#############################################################|
    |                        OAUTH FLOWS
    *##############################################################*/


    /* GOOGLE AUTHORIZATION CODE FLOW =========================================== */

    $("#btnGoogleAuthCodeGrant").on("click", function () {

        console.log("Initing google requests. Authorization code grant flow");

        OAuth.getCodePermissions('google', 'code', OAuth.OAUTH_AUTH_CODE_GOOGLE_REDIRECT_URI);

    });


    /* GOOGLE IMPLICIT FLOW =========================================== */

    $("#btnGoogleImplicitFlow").on("click", function () {

        console.log("Initing google requests");

        OAuth.getCodePermissions('google', 'token', OAuth.OAUTH_IMPLICIT_GOOGLE_REDIRECT_URI);


    });

    /* FACEBOOK IMPLICIT FLOW =========================================== */

    $("#btnFacebookImplicitFlow").on("click", function () {

        console.log("Initing facebook requests");

        OAuth.getCodePermissions('facebook', 'token', OAuth.OAUTH_IMPLICIT_FACEBOOK_REDIRECT_URI);

    });


    /*#############################################################|
    |                   ACCESS TOKEN HANDLING
    *##############################################################*/


    /* Access token =========================================== */

    //here we check if some access token were provided


    let output = OAuth.getAccessTokenOrCode();

    if (output) {
        if (output.code) {
            OAuth.getUserData('authorization-code-grant', null, output.code);
        } else if (output.access_token) {
            OAuth.getUserData('implicit', output.provider, output.access_token);
        }
    }


});
