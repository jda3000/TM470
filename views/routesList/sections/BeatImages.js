import React from "react";
import { Text, View } from "react-native";
import GridImageView from 'react-native-grid-image-viewer';

class BeatImages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.item,
    };
  }

  render () {
    if (!this.state.data) {
      return <Text>No data</Text>
    }
    return (
      <View style={{flex: 5, backgroundColor: 'white'}}>
        <GridImageView data={ this.state.data.files?.map(file => file.file) } />
      </View>
    )
  }
}

export default BeatImages
