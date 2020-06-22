import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewSource, WebViewSourceUri, WebViewNavigation, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';

type AppState = {
    source: WebViewSource;
}

const IOS_USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';
const ANDROID_USER_AGENT = 'Mozilla/5.0 (Android 4.4; Mobile; rv:46.0) Gecko/46.0 Firefox/46.0';

export default class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            source: { uri: 'https://mijn.uwv.nl/' }
        }
    }

    public render(): JSX.Element {
        const userAgent = Platform.OS === 'ios' ? IOS_USER_AGENT : ANDROID_USER_AGENT;

        if (Platform.OS === 'ios') {
            return (
                <View style={styles.container}>
                    <WebView
                        userAgent={userAgent}
                        style={{ flex: 1 }}
                        source={this.state.source}
                    />
                </View>
            );
        } else if (Platform.OS === 'android') {
            return (
                <View style={styles.container}>
                    <WebView
                        userAgent={userAgent}
                        style={{ flex: 1 }}
                        source={this.state.source}
                        onShouldStartLoadWithRequest={this._handleOnShouldStartLoadWithRequestAndroid}
                    />
                </View>
            );
        }
    }

    private _handleOnShouldStartLoadWithRequestAndroid = (event: WebViewNavigation) => {
        const { url: newURL } = event;

        if (newURL !== (this.state.source as WebViewSourceUri).uri) {
            console.log(`Set state -  uri: ${newURL}, referer: ${(this.state.source as WebViewSourceUri).uri}`);
            const refererer = !/login$/gi.test(newURL) ? (this.state.source as WebViewSourceUri).uri : 'https://www.uwv.nl/particulieren/mijnuwv/index.aspx';

            this.setState({
                source: {
                    uri: newURL,
                    headers: {
                        Referer: refererer
                    }
                }
            })
        }

        return false;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});
