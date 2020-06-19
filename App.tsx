import React, { useRef, useState, useCallback } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { WebViewSource, WebViewSourceUri, WebViewNavigation, WebViewNavigationEvent } from 'react-native-webview/lib/WebViewTypes';

type AppState = {
    source: WebViewSource;
}

export default class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);

        this.state = {
            source: { uri: 'https://mijn.uwv.nl/' }
        }
    }

    public render(): JSX.Element {
        if (Platform.OS === 'ios') {
            return (
                <View style={styles.container}>
                    <WebView style={{ flex: 1 }} source={this.state.source} />
                </View>
            );
        } else if (Platform.OS === 'android') {
            return (
                <View style={styles.container}>
                    <WebView style={{ flex: 1 }} source={this.state.source} onShouldStartLoadWithRequest={this._handleOnShouldStartLoadWithRequestAndroid}/>
                </View>
            );
        }
    }

    private _handleOnShouldStartLoadWithRequestAndroid = (event: WebViewNavigation) => {
        const { url: newURL } = event;

        if (newURL !== (this.state.source as WebViewSourceUri).uri) {
            console.log(`Set state -  uri: ${newURL}, referer: ${(this.state.source as WebViewSourceUri).uri}`);
            this.setState({
                source: {
                    uri: newURL,
                    headers: {
                        Referer: !/login$/gi.test(newURL) ? (this.state.source as WebViewSourceUri).uri : 'https://www.uwv.nl/particulieren/mijnuwv/index.aspx'
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
