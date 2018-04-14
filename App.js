/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  PropTypes,
  Image,
  Switch
} from "react-native";
import Tts from "react-native-tts";
import SpeechAndroid from "react-native-android-voice";
import faker from "faker";
import {
  Button,
  Icon,
  Header,
  Body,
  Title,
  Container,
  Text
} from "native-base";
import {
  PlaySound,
  StopSound,
  PlaySoundRepeat,
  PlaySoundMusicVolume
} from "react-native-play-sound";
import Toast from "react-native-toast-native";
import SmartMode from "./smartMode";

// type Props = {};
export default class App extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.getDialogFlow = this.getDialogFlow.bind(this);
    this.state = {
      showText: true,
      isReady: false,
      mode: false,
      pressStatus: false,
      message: "I GOT YOU BISH",
      fileNames: ["a", "b", "c", "d", "e", "f", "g", "h"]
    };
  }

  _onHideUnderlay = () => {
    this.setState({ pressStatus: false });
  };
  _onShowUnderlay = () => {
    this.setState({ pressStatus: true });
  };

  handlePress = () => {
    //const fakeText = ["Fuckyou", "SUck it", "I wDumbass", "Bazinga", "Yaas Queen"];
    this.setState({ showText: true, pressStatus: true });
    PlaySound(
      this.state.fileNames[
        Math.floor(Math.random() * this.state.fileNames.length)
      ]
    );
    /* if (this.state.showText) {
      //Tts.speak(fakeText[Math.floor(Math.random() * fakeText.length)]);
      this.setState({ showText: false });
    } */
  };

  changeMessage = () => {
    if (!this.state.pressStatus) {
      this.setState({
        message: "I GOT YOU BISH"
      });
    } else if (this.state.pressStatus) {
      this.setState({
        message: "TELL ME UR FEELINGS LOL"
      });
    } else {
      // Good luck seeing this shit
      this.setState({
        message: "VAPE NAYSH"
      });
    }
  };
  normalButton = () => {
    return (
      <Text style={{ fontSize: 30, color: "white", justifyContent: "center" }}>
        I GOT YOU BISH
      </Text>
    );
  };

  otherButton = () => {
    return (
      <Image
        source={require("./wave-icon.png")}
        style={{ width: 100, height: 100 }}
      />
    );
  };
  async getDialogFlow(msg) {
    const ACCESS_TOKEN = "b3508621503a4fe5b7c924a726ee73b6";

    try {
      const response = await fetch(
        `https://api.dialogflow.com/v1/query?v=20170712`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${ACCESS_TOKEN}`
          },
          body: JSON.stringify({
            query: msg,
            lang: "EN",
            sessionId: "somerandomthing"
          })
        }
      );
      let responseJson = await response.json();
      this.setState({
        showText: responseJson.result.fulfillment.speech
      });
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  onSwitch(value) {
    let damnit=["dumb","s"]
    this.setState({ mode: value });
    if (value) {
      Toast.show("You in the smart mode bitch!", Toast.SHORT, Toast.TOP);
      PlaySound('l');
    } else {
      Toast.show("You in the dumb mode bitch!", Toast.SHORT, Toast.TOP);
      PlaySound('l');
    }
  }

  render() {
    return (
      <Container>
        <Header style={{ height: 80 }}>
          <Body>
            <Title style={{ marginTop: 20 }}>
              1000 hours in ms paint &#169; Mark Zuckerburg
            </Title>
          </Body>
        </Header>
        <View style={styles.container}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>Dumb Mode</Text>
            <Switch
              onValueChange={value => this.onSwitch(value)}
              value={this.state.mode}
            />
            <Text>Smart Mode</Text>
          </View>
          {this.state.mode ? (
            <SmartMode />
          ) : (
            <TouchableHighlight
              activeOpacity={1}
              underlayColor={"#f2028e"}
              onHideUnderlay={this._onHideUnderlay}
              onShowUnderlay={this._onShowUnderlay}
              style={styles.basicButton}
              onPress={this.handlePress}
            >
              {!this.state.pressStatus
                ? this.normalButton()
                : this.otherButton()}
            </TouchableHighlight>
          )}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6e5cf9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lightblue"
  },
  basicButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 250,
    backgroundColor: "#e2689d",
    borderRadius: 100,
    marginBottom: 100,
    marginTop: 100
  }
});
