import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewSource, WebViewSourceUri, WebViewNavigation, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';

type AppState = {
    uri: string;
}

let headers = {};

const getHeaders = () => {
    console.log('I AM CALLED');
    return headers;
}

const IOS_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';
const ANDROID_USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36';


//https://www.npmjs.com/package/react-native-referer-webview
//https://yippeeclip.nl/headers
//https://github.com/react-native-webview/react-native-webview/issues/460

export default class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            uri: 'https://www.uwv.nl/particulieren/mijnuwv/index.aspx',
        }

        console.log('************************************************************')
    }

    public render(): JSX.Element {
        const userAgent = Platform.OS === 'ios' ? IOS_USER_AGENT : ANDROID_USER_AGENT;

        if (Platform.OS === 'ios') {
            return (
                <View style={styles.container}>
                    <WebView
                        userAgent={userAgent}
                        style={{ flex: 1 }}
                        source={{
                            uri: this.state.uri,
                            headers: getHeaders(),
                        }}
                    />
                </View>
            );
        } else if (Platform.OS === 'android') {
            return (
                <View style={styles.container}>
                    <WebView
                        userAgent={userAgent}
                        style={{ flex: 1 }}
                        source={{
                            uri: this.state.uri,
                            headers: getHeaders(),
                        }}
                        onShouldStartLoadWithRequest={this._handleOnShouldStartLoadWithRequestAndroid}
                    />
                </View>
            );
        }
    }

    private _handleOnShouldStartLoadWithRequestAndroid = (event: WebViewNavigation) => {
        const { url: newURL } = event;

        if (newURL !== this.state.uri) {
            //let referer = (this.state.source as WebViewSourceUri).uri

            if (
                // newURL.includes('https://mijn.uwv.nl/iam/digid') ||
                newURL.startsWith('https://mijn.uwv.nl/iam/login')
                // newURL.startsWith('https://digid.nl/saml/idp')
            ) {
                headers = {
                    Referer: 'https://www.uwv.nl/particulieren/mijnuwv/index.aspx',
                    customHeader: 'Fritsie'
                };

                this.setState({
                        uri: 'https://yippeeclip.nl/headers',
                        // uri: 'https://mijn.uwv.nl/iam/login'
                });

                return false;
                //referer = 'https://www.uwv.nl/particulieren/mijnuwv/index.aspx';
            }
            // const refererer = !/digid$/gi.test(newURL) ? (this.state.source as WebViewSourceUri).uri : 'https://www.uwv.nl/particulieren/mijnuwv/index.aspx';
            //console.log('0Request URL: ' + newURL.substring(0, 40) + ' with referer: ', referer);
        }

        return true;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
