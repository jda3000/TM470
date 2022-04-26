import React from "react";
import {
  StyleSheet,
  View,
  Modal,
  TextInput,
  Text,
  Button,
} from "react-native";


export default class SaveModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        description: null,
        start_time: new Date(),
        litter_collected_amount: 0,
        end_time: null
      },
    };
  }

  addOne() {
    this.setState({
      ...this.state,
      form: { ...this.state.form, litter_collected_amount: this.state.form.litter_collected_amount += 1},
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
          <TextInput
            style={styles.input}
            placeholder={"Description"}
            value={this.state.form.description}
            onChangeText={event => this.setState({ ...this.state, form: { ...this.state.form, description: event  } })}
          />

          <Button
            title="+"
            onPress={() => this.addOne()}
          />

          <Button
            title="-"
            onPress={() => this.subtractOne()}
          />
          <Text>{this.state.form.litter_collected_amount}</Text>

          <Button onPress={() => this.props.onSave(this.state.form)} title={"Save"} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

