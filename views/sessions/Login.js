import React from "react";
import { View, Text, TextInput, Button } from "react-native";

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
  }

  async login() {
    let response = await Session.login({username: this.state.username, password: this.state.password})

      // handle errors
      if (!response.success) {
      this.setState({...this.state, errors: response.errors})
    }
  }


  render () {
    return (
      <View>
        <Text>Login</Text>

        <TextInput
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
          value={this.state.password}
          onChangeText={(value) => this.setState({...this.state, password: value}) }
          placeholder='Password'
          autoCapitalize='none'
        />
        {this.state.errors?.password &&
          this.state.errors.password.map((error, key) => {
            return <Text key={key}>Password:  { error }</Text>
          })
        }

        <Button title='Login' onPress={this.login} />


        <Button title='Register' onPress={() => this.props.navigation.navigate('Register')} />


        {this.state.errors?.detail &&
          <Text>{ this.state.errors?.detail }</Text>
        }

      </View>
    )
  }
}
