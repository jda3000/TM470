import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  Text,
  Switch,
  Button,
  Pressable
} from "react-native";

const initialState = {
  form: {
    description: null,
    start_time: new Date(),
    litter_collected_amount: 0,
    end_time: null,
    private: false
  }
};
export default class SaveModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState}
    this.clearState = this.clearState.bind(this)
  }

  clearState () {
    this.setState({...initialState})
  }

  addOne() {
    this.setState({
      ...this.state,
      form: { ...this.state.form, litter_collected_amount: this.state.form.litter_collected_amount += 1 },
    });
  }

  subtractOne() {
    this.setState({
      ...this.state,
      form: { litter_collected_amount: this.state.form.litter_collected_amount > 0 ? this.state.form.litter_collected_amount -= 1 : this.state.form.litter_collected_amount, ...this.state.form },
    });
  }

  render() {
    return (
      <Modal
        animationType="slide"
        presentationStyle="formSheet"
        visible={this.props.show}
        onRequestClose={this.props.onResume}
      >
        <View style={styles.centeredView}>
          <Text style={styles.heading}>Save your route</Text>

          <TextInput
            style={styles.input}
            placeholder={"Description"}
            value={this.state.form.description}
            onChangeText={event => this.setState({ ...this.state, form: { ...this.state.form, description: event } })}
          />

          {this.state.errors?.description &&
            this.state.errors.description.map((error, key) => {
              return <Text style={styles.errorText} key={key}>Description: {error}</Text>;
            })
          }

          <Text style={styles.helpText}>Route description</Text>

          <View style={{ flexDirection: "row", justifyContent: 'space-around', marginTop: 20, marginBottom: 20 }}>
            <Pressable
              style={styles.button}
              onPress={() => this.subtractOne()}
            >
              <Text style={styles.buttonText}
              >-</Text>
            </Pressable>
            <Text style={{padding: 15}}>{this.state.form.litter_collected_amount} bags</Text>

            <Pressable
              style={styles.button}
              onPress={() => this.addOne()}
            >
              <Text style={styles.buttonText}>+</Text>
            </Pressable>
          </View>
          <Text style={styles.helpText}>Amount of litter collected</Text>


          <View style={{marginBottom: 20}}>
            <Switch
              value={this.state.form.private}
              onValueChange={value => this.setState({ ...this.state, form: { ...this.state.form, private: value } })} />
          </View>

          <Text style={styles.helpText}>Mark route as private</Text>

          <Button onPress={() => {
            this.props.onSave(this.state.form)
            this.clearState()
          }} title={"Save"} />

        </View>

      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    padding: 20,
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 15,
    backgroundColor: 'grey'
  },
  buttonText: {
    color: 'white',
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
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
  helpText: {
    fontSize: 12,
    marginBottom: 16,
  },
});

