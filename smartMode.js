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
import Voice from "react-native-voice";
// type Props = {};
export default class SmartMode extends Component {
  constructor(props) {
    super(props);
    this.handlePress = this.handlePress.bind(this);
    this.getDialogFlow = this.getDialogFlow.bind(this);
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechRecognized = this.onSpeechRecognized.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged.bind(this);
    this.state = {
      showText: true,
      isReady: false,
      mode: false,
      pressStatus: false,
      message: "I GOT YOU BISH",
      fileNames: ["a", "b", "c", "d", "e", "f", "g", "h"],
      speechOver: false
    };
  }

  onSpeechStart(e) {
    this.setState({
      started: "√"
    });
  }

  onSpeechRecognized(e) {
    this.setState({
      recognized: "√"
    });
  }

  onSpeechEnd(e) {
    this.setState({
      end: "√"
    });
  }

  onSpeechError(e) {
    this.setState({
      error: JSON.stringify(e.error)
    });
  }

  onSpeechResults(e) {
    this.setState({
      results: e.value
    });
    console.log("value", e.value);
  }

  onSpeechPartialResults(e) {
    this.setState({
      partialResults: e.value
    });
    console.log("Partial", e.value);
  }

  onSpeechVolumeChanged(e) {
    this.setState({
      pitch: e.value
    });
  }

  async _cancelRecognizing(e) {
    if (this.state.speechOver) {
      try {
        await Voice.cancel();
      const res=await this.getDialogFlow();
        Tts.speak(res.result.fulfillment.speech)
        console.log("It is over")
      } catch (e) {
        console.error(e);
      }
    }
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

  async _startRecognizing(e) {
    this.setState({ speechOver: true, showText: true, pressStatus: true });
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  }

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
  async getDialogFlow() {
    const ACCESS_TOKEN = "2aca5270239041c18c7737af28b0da6c";

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
            query: this.state.partialResults[0],
            lang: "EN",
            sessionId: "somerandomthing"
          })
        }
      );
      let responseJson = await response.json();
      console.log("damn it", responseJson);
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }

  onSwitch(value) {
    this.setState({ mode: value });
    Toast.show("This is a toast.", Toast.SHORT, Toast.TOP);
  }

  render() {
    return (
      <View>
        <TouchableHighlight
          activeOpacity={1}
          underlayColor={"#f2028e"}
          onHideUnderlay={this._onHideUnderlay}
          onShowUnderlay={this._onShowUnderlay}
          style={styles.basicButton}
          onPress={this._startRecognizing.bind(this)}
        >
          {!this.state.pressStatus ? this.normalButton() : this.otherButton()}
        </TouchableHighlight>

        <TouchableHighlight style={{marginTop:50}} onPress={this._cancelRecognizing.bind(this)}>
          <Text>Cancel</Text>
        </TouchableHighlight>
      </View>
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
