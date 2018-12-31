import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import FBSDK, {LoginManager, LoginButton, ShareDialog} from 'react-native-fbsdk';

export default class App extends Component {
    constructor (props) {
        super (props);
        const shareLinkContent = {
            contentType: 'link',
            contentUrl: "https://facebook.com",
            contentDescription: 'Facebook sharing is easy!',
        };
        this.state = {
            shareLinkContent: shareLinkContent
        }
    }

    _fbAuth = () => {
        LoginManager.logInWithReadPermissions(['public_profile']).then(function (result) {
            if (result.isCancelled) {
                console.log('Login is cancelled');
            } else {
                console.log('Login is Success ' + result.grantedPermissions.toString());
            }
        }, function (error) {
            console.log('An error Occured: ' + error);
        })
    };
    shareLinkWithShareDialog = () => {
        var tmp = this;
        ShareDialog.canShow(this.state.shareLinkContent).then(function(canShow) {
            if (canShow) {
                return ShareDialog.show(tmp.state.shareLinkContent);
            }
        }).then( function(result) {
            if (result.isCancelled) {
                alert('Share operation was cancelled');
            } else {
                alert('Share was successful with postId: '
                    + result.postId);
            }
        }, function(error) {
            alert('Share failed with error: ' + error.message);
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this._fbAuth()}>
                    <Text>Facebook Login</Text>
                </TouchableOpacity>
                <LoginButton
                    onLoginFinished={
                        (error, result) => {
                            if (error) {
                                alert("Login failed with error: " + error.message);
                            } else if (result.isCancelled) {
                                alert("Login was cancelled");
                            } else {
                                alert("Login was successful with permissions: " + result.grantedPermissions)
                            }
                        }
                    }
                    onLogoutFinished={() => alert("User logged out")}/>
                <TouchableOpacity onPress={() => this.shareLinkWithShareDialog()}>
                    <Text style={styles.shareText}>Share link with ShareDialog</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});
