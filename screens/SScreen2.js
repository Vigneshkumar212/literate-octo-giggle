import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

export default class SScreen2 extends Component {
  constructor() {
    super()
    this.state = {
      studentId: firebase.auth().currentUser.email,
      studentName: "",
      allAssignments: []
    }
    this.assignmentRef = null
  }

  getSudentDetails = (studentId) => {
    db.collection("users").where("email_id", "==", studentId).get().then((snapshot) => {
      snapshot.forEach((doc) => {
        this.setState({
          "studentName": doc.data().first_name + " " + doc.data().last_name
        })
      });
    })
  }

  getAllAssignments = () => {
    this.assignmentRef = db.collection("assignments").where("email_id", '==', this.state.studentId).where('assignmentStatus', '==', 'submitted').onSnapshot((snapshot) => {
      var allAssignments = []
      snapshot.docs.map((doc) => {
        var assignment = doc.data()
        assignment["doc_id"] = doc.id
        allAssignments.push(assignment)
      });
      this.setState({
        allAssignments: allAssignments
      });
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item, i }) => (
    <ListItem
      key={i}
      title={"Submitted"}
      subtitle={'Status : '+item.assignmentStatus+"\n Submitted on "+item.submittedDate}
      titleStyle={{ color: 'black', fontWeight: 'bold' }}
      rightElement={
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: item.request_status === "Book Sent" ? "green" : "#ff5722"
            }
          ]}
          onPress={() => {
            this.sendBook(item)

          }}
        >
          <Text style={{ color: '#ffff' }}>{
            item.request_status === "Book Sent" ? "Book Sent" : "Send Book"
          }</Text>
        </TouchableOpacity>
      }
      bottomDivider
    />
  )

  componentDidMount() {
    this.getSudentDetails(this.state.studentId)
    this.getAllAssignments()
  }

  componentWillUnmount() {
    this.assignmentRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="Submitted" />
        <View style={{ flex: 1 }}>
          {
            this.state.allAssignments.length === 0
              ? (
                <View style={styles.subtitle}>
                  <Text style={{ fontSize: 20 }}>List of Submitted Assignments</Text>
                </View>
              )
              : (
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.allAssignments}
                  renderItem={this.renderItem}
                />
              )
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    elevation: 16
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})