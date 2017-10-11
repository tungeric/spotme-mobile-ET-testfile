import React from 'react';
import { Image, Button, Text, View } from 'react-native';
import { AuthSession } from 'expo';
// import Config from 'react-native-config';

// console.log("Config", Config);
// import CreateUserForm from './frontend/components/users/user_sign_up_form.jsx'

const FB_APP_ID = "121254715227496";
const FB_APP_SECRET = "4146d81444dc52d45196c7532140de85";

export default class FacebookSessionForm extends React.Component {
    state = {
        userInfo: null,
    };

    _handlePressAsync = async () => {
        const redirectUrl = "https://auth.expo.io/@tungeric/mobile" // AuthSession.getRedirectUrl(); // 'http://localhost:3000/api/users/auth/facebook/callback' //

        // You need to add this url to your authorized redirect urls on your Facebook app
        console.log({ redirectUrl });

        // NOTICE: Please do not actually request the token on the client (see:
        // response_type=token in the authUrl), it is not secure. Request a code
        // instead, and use this flow:
        // https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#confirm
        // The code here is simplified for the sake of demonstration. If you are
        // just prototyping then you don't need to concern yourself with this and
        // can copy this example, but be aware that this is not safe in production.

        const result = await AuthSession.startAsync({
            authUrl:
            `https://www.facebook.com/v2.8/dialog/oauth?response_type=code` +
            `&client_id=${FB_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}`,
        });
        console.log("RESULT IS HERE YAY", result);
        console.log("-------------------------")

        if (result.type !== 'success') {
            alert('Uh oh, something went wrong');
            return;
        }

        const accessCode = result.params.code;
        console.log("CODE", accessCode)
        console.log("--------------------")
        const accessTokenResponse = await fetch(
            `https://graph.facebook.com/v2.10/oauth/access_token?` +
            `client_id=${FB_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
            `&client_secret=${FB_APP_SECRET}` +
            `&code=${accessCode}`
        )

        console.log("Access Token Response", accessTokenResponse);
        console.log("--------------------")

        const accessTokenJson = await accessTokenResponse.json();
        console.log("Access Token JSON", accessTokenJson);

        const accessToken = accessTokenJson.access_token;


        // let accessToken = result.params.access_token;
        const userInfoResponse = await fetch(
            `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        console.log("User Info", userInfo);
        console.log("--------------------")
        this.setState({ userInfo });
    };

    _renderUserInfo = () => {
        console.log("STATE", this.state);
        return (
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={{ uri: this.state.userInfo.picture.data.url }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                />
                <Text style={{ fontSize: 20 }}>{this.state.userInfo.name}</Text>
                <Text>ID: {this.state.userInfo.id}</Text>
            </View>
        );
    };

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {!this.state.userInfo ? (
                    <Button title="Login with Facebook" onPress={this._handlePressAsync} />
                ) : (
                        this._renderUserInfo()
                    )}
            </View>
        );
    }

}
