import { StyleSheet, } from 'react-native';
export const homeStyle = StyleSheet.create({
   addButtonStyle:{
      backgroundColor:"#633a82",
      borderWidth:0,
      borderRadius:50,
      height:50,
      width:200,
      alignSelf: 'center',
      shadowOffset:{  width: 10,  height: 10,  },
      shadowColor: 'black',    
      borderColor: '#ddd',
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5
   },   
   title:{
        color:"#72b5b7",
        fontWeight: 'bold',
   },
   numberOfTasks:{
    color:"grey"

   },
   card:{
      margin: 8,
      shadowOffset:{  width: 10,  height: 10,  },
      shadowColor: 'black',
      
      borderColor: '#ddd',
      shadowOpacity: 0.8,
      shadowRadius: 2,
      elevation: 5

   },
   button:{
      position: 'absolute',
      right: 0
   },
   icon2: {
      margin: 5,
      alignSelf: 'flex-start',
      position: 'absolute',
      top: 10,     
      borderRadius: 50
   },
   text: {
      fontSize: 16,
      lineHeight: 21,
      alignSelf: 'flex-start',
      bottom: 75,
      width: 330,
      margin: 15,
      backgroundColor: 'black',
      display: 'flex',
      justifyContent: 'center',
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      shadowRadius: 2
    },
    MainContainer :{
 
      justifyContent: 'center',
      flex:1,
      margin: 20
    },
    
    TextStyle: {
    
     textAlign: 'center', 
     fontSize: 10,
     textDecorationLine: 'line-through', 
     textDecorationStyle: 'solid', 
     color: '#000'
    
    },
    icon1 :{
      margin: 5,
      alignSelf: 'flex-start',
      position: 'absolute',
      top: 27,     
      borderRadius: 50,
      fontWeight: 'bold',
      fontSize: 20,
      left: 20
    },
    inputStyle :{
       margin: 15,
       borderColor: 'white',
       backgroundColor: 'white',
       alignItems: 'stretch',
       width: 350,
       alignSelf: 'center',
       alignContent: 'flex-start'
    },
    text2: {
      color: 'grey'
    },
    abc: {
      position: 'absolute',
      bottom: 20,
      right: 150,
      width: 50,
      height: 50,
    }
   
});