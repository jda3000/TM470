import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import Session from "../../sessionHandler";


export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password1: null,
      password2: null,
    };
    this.register = this.register.bind(this);
  }

  async register() {
    console.log("register");
    let response = await Session.register({
      username: this.state.username,
      password1: this.state.password1,
      password2: this.state.password2,
    });

    // handle errors
    if (!response.success) {
      this.setState({ ...this.state, errors: response.errors });
    }
  }

  render() {
    return (
      <View>
        <Text>Register</Text>

        <TextInput
          value={this.state.username}
          onChangeText={(value) => this.setState({ ...this.state, username: value })}
          placeholder="Username"
          autoCapitalize="none"
        />
        {this.state.errors?.username &&
          this.state.errors.username.map((error, key) => {
            return <Text key={key}>Username: {error}</Text>;
          })
        }

        <TextInput
          value={this.state.password1}
          onChangeText={(value) => this.setState({ ...this.state, password1: value })}
          placeholder="Password"
          autoCapitalize="none"
        />
        {this.state.errors?.password1 &&
          this.state.errors.password1.map((error, key) => {
            return <Text key={key}>Password: {error}</Text>;
          })
        }

        <TextInput
          value={this.state.password2}
          onChangeText={(value) => this.setState({ ...this.state, password2: value })}
          placeholder="Password Repeat"
          autoCapitalize="none"
        />
        {this.state.errors?.password2 &&
          this.state.errors.password2.map((error, key) => {
            return <Text key={key}>Password: {error}</Text>;
          })
        }

        <Button title="Register" onPress={this.register} />

      </View>
    );
  }
}
