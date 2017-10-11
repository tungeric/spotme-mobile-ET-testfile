import React from 'react'
import { View, Button } from 'react-native'
import FacebookSessionForm from '../SessionForm/FacebookSessionForm.js';

import styles from '../../../styles/styles'

export default class WelcomeScreen extends React.Component {

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.screen}>
        <FacebookSessionForm />
      </View>
    )
  }

}
