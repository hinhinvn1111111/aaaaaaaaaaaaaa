// import React from 'react';
import React, { Component,PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image
} from 'react-native';
import {IMG_HEADER} from '../../../constants/uri';
import AsyncStorage from '@react-native-community/async-storage';
import {GiftedChat, Bubble, SystemMessage} from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
// import { arr } from '../giohang/api';
// import {connect} from 'react-redux';
var socket;
var arrT = [{
  _id: Math.round(Math.random() * 1000000),
  text:
    "can you talk to me ?",
  createdAt: new Date(Date.UTC(2019, 1, 30, 17, 20, 0)),
  user: {
    _id: 2,
    name: "Developer"
  }
}];
class Chat extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messages1: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      open: false,
      connected: false,
      checklogin : null,
      m : [
        'My name is Funny. What is yours ?',
        'Nice to meet you, too !',
        'Pp. See ya',
        'What proplem ?',
        "oh. I also want to but we can't. you knowed that: ((",
        'Talk to me whenever you need',
        'Pp',
        'Nice to meet you, too !',
        'Pp. See ya'
      ],
      dem : 0
    };

    socket = new WebSocket('ws://192.168.1.103:8080/');
    socket.onopen = () => {
      this.setState({connected:true});
    }; 
    socket.onmessage = (e) =>{
      const obj = JSON.parse(e.data);
      const arr = Object.keys(obj).map(key => {
      this.onReceive(obj[key][0]);
      })
    }

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderSystemMessage = this.renderSystemMessage.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('check_login');
      if(value !== null) {
        this.setState({checklogin:value});
        console.log(value);
      }else{
        console.log('a---------');
      }
    } catch(e) {
      // error reading value
      console.log('error---------');
    }
  }

  // getMessage(id1,id2){
  //   fetch('http://192.168.1.103/KLTN/Do-An/Mozala-Engine-/php/getMessage.php',{
  //       method:'POST',
  //       body:JSON.stringify({
  //           ID1 : id1,
  //           ID2:id2
  //       })
  //       })
  //       .then((response)=>response.json())
  //       .then((responsiveJSON)=>{
          
  //         var x=0;
  //         var itemT = {
  //           _id: Math.round(Math.random() * 1000000),
  //           text:
  //             "can you talk to me ?",
  //           createdAt: new Date(Date.UTC(2019, 1, 30, 17, 20, 0)),
  //           user: {
  //             _id: 2,
  //             name: "Developer",
  //             avatar: this.props.image
  //           }
  //         }
  //         for(let i of responsiveJSON){
  //           // console.log(i.text);
  //           itemT._id=i.key;
  //           itemT.text=i.text;
  //           itemT.createdAt=new Date(Date.UTC(2019, 1, 30, 17, 20, 0));
  //           itemT.user._id=i.key;
  //           itemT.user.name=this.props.ThuongHieu;
  //           itemT.avatar= this.props.image;
  //           console.log(itemT);
  //           arrT.push(itemT);
  //           console.log(arrT.length);
  //           // arrT.push(itemT);
  //           this.state.messages1.push(itemT);
  //         }
  //         // this.setState({messages:arrT});
          
  //       })
  //       .catch((e)=>{
  //           console.log('lỗi messenger' + e);
  //   })
  // }

  componentWillMount=async()=> {
    this._isMounted = true;
    this.setState({messages: this.props.mess});
    await this.getData();
 
  }
  // renderLoading=()=>{
  //   console.log('aaaaaaaaaaaaaaaa');
  // }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('./old_messages')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }
  
  onSend(messages = []) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    if( this.state.connected ) {
      socket.send(JSON.stringify({
          messgaes: messages,
      }))
      this.setState(prevState => ({ open: !prevState.open }))
    }
    // this.onReceive('aaaaaaaaa');
    // this.answerDemo(messages);
  }
  
  // answerDemo(messages) {
  //   if (messages.length > 0) {
  //         if ((messages[0].text || messages[0].location) || !this._isAlright) {
  //           this.setState((previousState) => {
  //             return {
  //               typingText: 'Funny is replying'
  //             };
  //           });
  //         }
  //       }
    
  //   setTimeout(() => {
  //     this._isAlright = true;
  //     // this.onReceive(this.state.m[this.state.dem]);
  //     this.setState({dem:this.state.dem+1});
  //     this.setState((previousState) => {
  //       return {
  //         typingText: null,
  //       };
  //     });
  //   }, 1000);
  // }

  onReceive(obj) {
    // console.log(id + '---' + text);
    var t  = obj.user._idSR.split(",");
    if((t[1]===this.state.checklogin && t[0]===this.props.ID_NBH) ||(t[0]===this.state.checklogin && t[1]===this.props.ID_NBH)){
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, {
            _id: Math.round(Math.random() * 1000000),
            text: obj.text,
            createdAt: obj.createdAt,
            user: {
              _id: t[0],
              name: this.props.ThuongHieu,
              avatar: this.props.image,
            },
          }),
        };
      });
    }
    
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    // return (
    //   <Actions
    //     {...props}
    //     options={options}
    //   />
    // );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: 14,
        }}
      />
    );
  }

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={{flex: 1,backgroundColor: ''}}>
        <ImageBackground style={{height:50,flexDirection:'row'}} source={{uri:IMG_HEADER}}>
            <View style={{flex: 1,justifyContent: 'center',alignItems: 'center',}}>
                <TouchableOpacity onPress={()=>Actions.pop()}>
                    <Image 
                        style={{width:22,height:22,resizeMode:'cover'}}
                        source={require('../../assets/images/backios.png')}
                    />
                </TouchableOpacity>
            </View>
            <View style={{flex:8,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize: 16,color:'#fff'}}>{this.props.ThuongHieu}</Text>
            </View>
        </ImageBackground>
        <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}
        user={{
          // _id: this.state.checklogin < this.props.item.ID_NBH ? this.state.checklogin + ',' + this.props.item.ID_NBH :this.props.item.ID_NBH + ',' + this.state.checklogin,
          _idSR: this.state.checklogin + ',' + this.props.ID_NBH, // sent messages should have same user._id
          _id: this.state.checklogin ,
          // name:this.props.ThuongHieu
          
        }}

        renderActions={this.renderCustomActions}
        renderBubble={this.renderBubble}
        renderSystemMessage={this.renderSystemMessage}
        renderCustomView={this.renderCustomView}
        renderFooter={this.renderFooter}
        // renderLoading={this.renderLoading}
      />
      </View>
      // <GiftedChat
      //   messages={this.state.messages}
      //   onSend={this.onSend}
      //   loadEarlier={this.state.loadEarlier}
      //   onLoadEarlier={this.onLoadEarlier}
      //   isLoadingEarlier={this.state.isLoadingEarlier}

      //   user={{
      //     _id: 1, // sent messages should have same user._id
      //   }}

      //   renderActions={this.renderCustomActions}
      //   renderBubble={this.renderBubble}
      //   renderSystemMessage={this.renderSystemMessage}
      //   renderCustomView={this.renderCustomView}
      //   renderFooter={this.renderFooter}
        
      // />
      
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
});

function mapStateToProps(state){
  return { 
      mess : state.messages
  };
}

export default connect(mapStateToProps,{})(Chat);