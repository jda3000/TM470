import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

import Session from "../../sessionHandler";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      errors: null
    }
    this.login = this.login.bind(this)
    this.clearErrors = this.clearErrors.bind(this)
  }

  clearErrors() {
    this.setState({...this.state, errors: null})
  }

  async login() {
    this.clearErrors()
    let response = await Session.login({username: this.state.username, password: this.state.password})
      // handle errors
      if (!response.success) {
      this.setState({...this.state, errors: response.errors})
    }
  }

  render () {
    return (
      <View style={{padding: 20, flex: 1, flexDirection: 'column', alignContent: 'center', justifyContent: 'space-between'}}>


        <View style={{flex: 5}}>
          <Text style={styles.heading}>Welcome</Text>
          <TextInput
            style={styles.input}
            value={this.state.username}
            onChangeText={(value) => this.setState({...this.state, username: value}) }
            placeholder='Username'
            autoCapitalize='none'
          />

          {this.state.errors?.username &&
            this.state.errors.username.map((error, key) => {
              return <Text key={key}>Username:  { error }</Text>
            })
          }

          <TextInput
            style={styles.input}
            value={this.state.password}
            onChangeText={(value) => this.setState({...this.state, password: value}) }
            placeholder='Password'
            autoCapitalize='none'
            secureTextEntry={true}
          />

          {this.state.errors?.password &&
            this.state.errors.password.map((error, key) => {
              return <Text key={key}>Password:  { error }</Text>
            })
          }

          {this.state.errors?.detail &&
            <Text style={styles.error}>{ this.state.errors?.detail }</Text>
          }

          <Button title='Login' onPress={this.login} />
        </View>

        <View style={{flex: 1, textAlignVertical: "center",textAlign: "center",}}>
          <Text style={{textAlignVertical: "center",textAlign: "center"}}>Not got an account?</Text>
          <Button title='Register' onPress={() => this.props.navigation.navigate('Register')} />

          <Button title='Forgotten Password?' onPress={() => this.props.navigation.navigate('ForgottenPassword')} />
        </View>
      </View>
    )
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
    marginBottom: 20
  },
  error: {
    color: 'red'
  }
});
