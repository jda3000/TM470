import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import Session from "../../sessionHandler";


export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      email: null,
      password1: null,
      password2: null,
      errors: null
    };
    this.register = this.register.bind(this);
    this.clearErrors = this.clearErrors.bind(this)
  }
  clearErrors() {
    this.setState({...this.state, errors: null})
  }
  async register() {
    this.clearErrors()
    let response = await Session.register({
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password_repeat: this.state.password_repeat,
    });

    // handle errors
    if (!response.success) {
      this.setState({ ...this.state, errors: response.errors });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 20 }}>

        <Text style={styles.heading}>Create your account</Text>

        <TextInput
          style={styles.input}
          value={this.state.username}
          onChangeText={(value) => this.setState({ ...this.state, username: value })}
          placeholder="Username"
          autoCapitalize="none"
        />

        {this.state.errors?.username &&
          this.state.errors.username.map((error, key) => {
            return <Text style={styles.errorText} key={key}>Username: {error}</Text>;
          })
        }
        <Text style={styles.helpText}>Choose a username</Text>


        <TextInput
          style={styles.input}
          value={this.state.email}
          onChangeText={(value) => this.setState({ ...this.state, email: value })}
          placeholder="Your email address"
          autoCapitalize="none"
        />

        {this.state.errors?.email &&
          this.state.errors.email.map((error, key) => {
            return <Text style={styles.errorText} key={key}>Email: {error}</Text>;
          })
        }
        <Text style={styles.helpText}>Enter your email address</Text>


        <TextInput
          style={styles.input}
          value={this.state.password}
          onChangeText={(value) => this.setState({ ...this.state, password: value })}
          placeholder="Password"
          autoCapitalize="none"
          secureTextEntry={true}
        />

        {this.state.errors?.password &&
          this.state.errors.password.map((error, key) => {
            return <Text style={styles.errorText} key={key}>Password: {error}</Text>;
          })
        }
        <Text style={styles.helpText}>Enter your password</Text>

        <TextInput
          style={styles.input}
          value={this.state.password_repeat}
          onChangeText={(value) => this.setState({ ...this.state, password_repeat: value })}
          placeholder="Password Repeat"
          autoCapitalize="none"
          secureTextEntry={true}
        />

        {this.state.errors?.password_repeat &&
          this.state.errors.password_repeat.map((error, key) => {
            return <Text style={styles.errorText} key={key}>Password: {error}</Text>;
          })
        }
        <Text style={styles.helpText}>Confirm your password</Text>


        <Button title="Register" onPress={this.register} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 5,
    borderWidth: 1,
    padding: 10,
  },
  heading: {
    fontSize: 30,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
  helpText: {
    fontSize: 12,
    marginBottom: 16,
  }
});
