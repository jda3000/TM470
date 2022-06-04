import React from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import Session from "../../sessionHandler";


export default class ForgottenPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      errors: null,
      successMessage: null,
    };
    this.forgottenPassword = this.forgottenPassword.bind(this);
    this.clearErrors = this.clearErrors.bind(this);
    this.clearForm = this.clearForm.bind(this);
  }

  clearErrors() {
    this.setState({ ...this.state, errors: null, successMessage: null });
  }

  clearForm() {
    this.setState({ ...this.state, email: null });
  }

  async forgottenPassword() {
    this.clearErrors();
    let response = await Session.forgottenPassword({ email: this.state.email }).catch(error => console.log(error));
    if (response.success) {
      this.clearForm();
      this.setState({ ...this.state, successMessage: response.data });
    } else {
      this.setState({ ...this.state, errors: response.errors });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 20 }}>
        <Text style={styles.heading}>Forgotten Password</Text>
        <TextInput
          style={styles.input}
          value={this.state.email}
          onChangeText={(value) => this.setState({ ...this.state, email: value })}
          placeholder="Username"
          autoCapitalize="none"
        />
        <Text style={styles.helpText}>
          Enter your email address associated with your account, if you have an account a password reset email will be
          sent
        </Text>
        {
          this.state.successMessage ? <Text style={styles.successText}>{this.state.successMessage}</Text> : null
        }

        {this.state.errors?.email && this.state.errors.email.map((error, key) => {
          return <Text style={styles.errorText} key={key}>Email: {error}</Text>;
        })
        }

        {
          this.state.successMessage ?
            <Button title="Return to Login" onPress={() => this.props.navigation.navigate("Login")} />
            :
            <Button title="Reset" onPress={this.forgottenPassword} />
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
  },
  heading: {
    fontSize: 30,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
  },
  successText: {
    color: "green",
  },
  helpText: {
    fontSize: 12,
    marginBottom: 16,
  },
});
