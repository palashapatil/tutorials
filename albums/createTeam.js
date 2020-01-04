import React, { Component } from "react";
import {
  Button,
  StyleSheet,
  View,
  Alert,
  FlatList,
  Dimensions,
  ImageBackground,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ScrollView,
  Animated,
  Platform,
  Easing,
  BackHandler
} from "react-native";
import Text from "ucl-live-manager/app/components/CommonComponents/DefaultText";
import EStyleSheet from "react-native-extended-stylesheet";
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
import LinearGradient from "react-native-linear-gradient";
// import Navigator from "@bam.tech/native-navigation";

import { BgImageContainer } from "../components/BgImageContainer";
import { connect } from "react-redux";
import Modal from "react-native-modal";
import * as Actions from "../actions";
import { bindActionCreators } from "redux";

import commonStyles from "./styles.js";

import TeamPlayerSlot from "../components/TeamPlayerSlot";
import MyText from "../components/CommonComponents/MyText";
import MyTextFont from "../components/CommonComponents/MyTextFont";

import SVGImageShape from "../components/CommonComponents/SVGImageShape";

import _ from "lodash";
import Toast, { DURATION } from "react-native-easy-toast";
import THEMES, { COLORS, LAYOUT, FONTS } from "ucl-live-manager/app/themes";
import FilterPopupLayer from "../components/FilterPopupLayer";
import PlayerListLayerHeader from "../components/PlayerListLayerHeader";
import PlayerListLayer from "../components/PlayerListLayer";
import Header from "../components/CommonComponents/Header/Header";
import { NavigationActions } from "react-navigation";
import {
  createIconSetFromIcoMoon,
  createIconSetFromFontello
} from "react-native-vector-icons";
import fontelloConfig from "../assets/config/config.json";
const Icon = createIconSetFromFontello(fontelloConfig);
import MyIcon from "../components/MyIcon";
import DrawerPopup from "../components/CommonComponents/DrawerPopup";
import SwipeableToast from "../components/CommonComponents/SwipeableToast";
import track from "ucl-live-manager/app/common/track";

import {
  chkToastMsg,
  hasEmptySlot,
  getCreateTeamData,
  checkDifference,
  convertCookies,
  getTransferredPlyrs,
  getAsyncItem,
  setAsyncItem,
  getCurrentMatchStatus,
  returnErrMsg,
  getCurrLiveMatchData,
  setCurScreen,
  checkLiveRedCard,
  chkLoginStatus
} from "../common";

import moment from "moment";
import playerListPanel from "../images/Player_List_Panel/Player_List_Panel.png";
import filterLayerBackground from "../images/Filter_Popover_BG/Filter_Popover_BG.png";
import GradientButton from "../common/GradientButton";

import PlayerDetailModal from "../components/PlayerDetailModal";

class CreateTeam extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontLoaded: true,
      isFilterModalVisible: false,
      isSortModalVisible: false,
      manageTeamBackPress: false,
      slideAnimation: new Animated.Value(0),
      opacity: new Animated.Value(0),
      contBottom: new Animated.Value(-100),
      managecontBottom: new Animated.Value(-100),
      playerListAnimatedStyleSearch: new Animated.Value(0),
      toastMsg: <View />,
      showOpacity: false,
      isFirstTimeRender: true,
      bottomPlayerListView: new Animated.Value(-95),
      isFilterPopupVisible: false,
      isToastVisible: false,
      isFirstTimeError: true,
      toastLayer: new Animated.Value(-95),
      saveTeamDisabled: false,
      shouldComponentUpdateFlag: true,
      toastType: ""
    };

    this.handlePlayerList = this.handlePlayerList.bind(this);
    this.handlePopupLayer = this.handlePopupLayer.bind(this);
    this.filterLayerSlideAnimation = this.filterLayerSlideAnimation.bind(this);
    this.setTeamFilter = this.setTeamFilter.bind(this);
    this.handleFilterReset = this.handleFilterReset.bind(this);
    this.handleCreateTeamPost = this.handleCreateTeamPost.bind(this);
    this.cachePlayerData = this.cachePlayerData.bind(this);
    this.handleResetTeam = this.handleResetTeam.bind(this);
    this.handleSaveTeam = this.handleSaveTeam.bind(this);
    this.handleContinueClick = this.handleContinueClick.bind(this);
    this.callSaveTeamPage = this.callSaveTeamPage.bind(this);
    this.callMountFunc = this.callMountFunc.bind(this);
    this.triggerFilter = this.triggerFilter.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onCreateTeamBackPressed = this.onCreateTeamBackPressed.bind(this);
    this.handleErrMessage = this.handleErrMessage.bind(this);
    this.callSummaryPage = this.callSummaryPage.bind(this);
    this.onAndroidBackPressed = this.onAndroidBackPressed.bind(this);
  }
  closeModal = () => {
    this.setState({
      manageTeamBackPress: true,
      isToastVisible: true
    });
  };

  onCreateTeamBackPressed(setSuccessMsgFlag, response) {
    let self = this;
    let currGameStatus = getCurrentMatchStatus(this.props.curFixture);

    // Navigator.pop();
    // if (this.props.curGameMode != "createTeam") {
    //   Navigator.push(
    //     "Games/"+global.gameId+"/SummaryPage",
    //   )
    // }

    if (this.props.curGameMode == "createTeam") {
      this.onAndroidBackPressed("AllMatches");
      this.props.navigation.goBack(null);
    } else {
      this.onAndroidBackPressed("SummaryPage");
      this.props.navigation.goBack(null);

      if (
        this.props.oldTeamData &&
        (setSuccessMsgFlag || currGameStatus == 1)
      ) {
        // change condition set a flag in teamdata itself and change whenever team is submitted
        this.props.triggerResetTeam([]);
        setTimeout(function() {
          self.props.triggerCreateTeamDataFromCache(self.props.oldTeamData);
        }, 10);
      }
    }
    if (setSuccessMsgFlag) {
      if (currGameStatus == 0) {
        let msg = {
          toastHeading: returnErrMsg("createTeam", 1)
        };
        this.props.setToastMsg(msg);
      } else if (currGameStatus == 1) {
        if (global.UserTeamPlayerTrans && global.UserTeamPlayerTrans.length) {
          for (var i = 0; i < global.UserTeamPlayerTrans.length; i++) {
            var curObj = global.UserTeamPlayerTrans[i];
            var inplyrObj = this.props.completePlayersObj[curObj.InPlayerId];
            let teamsPlyr = response.filter(function(plyr) {
              if (plyr.Id == curObj.InPlayerId) return plyr;
            });
            var outplyrObj = this.props.completePlayersObj[curObj.OutPlayerId];
            var msg = {
              msgId: self.props.multiToastMsg.length + 1,
              toastHeading: self.props.translations.subOrderTxt
                ? self.props.translations.subOrderTxt
                : "Substitution Ordered",
              toastDesc:
                inplyrObj.PDName + " " + self.props.startPlyngFrm
                  ? self.props.startPlyngFrm
                  : "will start scoring from" +
                    " " +
                    teamsPlyr[0].FromMinute +
                    "'"
            };
            var transPlyrObj = {
              MID: this.props.curFixture.MID,
              transId: this.props.toastMsgteam.length + 1,
              popupTime: teamsPlyr[0].FromMinute,
              inplyrObj,
              outplyrObj
            };
            self.props.setTeamToastMsg(transPlyrObj);
            self.props.setMultiToastMsg(msg);
          }
        }
      }
    }

    //
  }

  async callMountFunc(nextProps) {
    let self = this;
    if (nextProps.curGameMode == "createTeam") {
      track.screen("create-team", null);
      if (
        typeof this.props.cachedTeamData[this.props.curFixture.MID] ==
        "undefined"
      ) {
        this.props.triggerCreateTeamData(
          this.props.teamData,
          this.props.minTeamPlyrs
        );
        this.props.triggerCacheInitData(
          this.props.curFixture.MID,
          this.props.minTeamPlyrs
        );
      } else {
        this.props.triggerCreateTeamDataFromCache(
          this.props.cachedTeamData[this.props.curFixture.MID]
        );
      }
    } else {
      let matchStatus = getCurrentMatchStatus(this.props.curFixture);
      if (matchStatus == 1 || matchStatus == 2) {
        track.screen("make-substitutions", null);
      } else {
        track.screen("manage-team", null);
      }
    }
    // else {
    //   let val = await getAsyncItem("cookie");
    //   let guid = convertCookies(val.UCLLM_FAN).guid;
    //   this.props.triggerGetTeamData(
    //     this.props.curFixture.GDID,
    //     guid,
    //     val,
    //     this.props.createTeamBuster
    //   );
    // }
    this.props.triggerFetchPlayers(
      this.props.curFixture,
      self.cachePlayerData,
      this.props.curLang
    );
    // if (
    //   typeof this.props.cachedPlayerData[this.props.curFixture.MID] ==
    //   "undefined"
    // ) {
    //   this.props.triggerFetchPlayers(
    //     this.props.curFixture,
    //     self.cachePlayerData
    //   );
    // } else {
    //   this.props.triggerSetPlayersFromCache(
    //     this.props.cachedPlayerData[this.props.curFixture.MID]
    //   );
    // }
  }

  onAndroidBackPressed(screen) {
    if (!screen) {
      if (this.props.curGameMode == "createTeam") {
        screen = "AllMatches";
      } else {
        screen = "SummaryPage";
      }
    }
    setCurScreen(screen);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      "hardwareBackPress",
      this.onAndroidBackPressed
    );

    if (hasEmptySlot(this.props.teamData)) {
      if (this.props.curGameMode == "createTeam") {
        Animated.timing(this.state.contBottom, {
          toValue: 0,
          duration: 300,
          delay: 500
        }).start();
      }
    }
    this.callMountFunc(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (hasEmptySlot(nextProps.teamData)) {
      this.setState({
        showOpacity: true
      });
    } else {
      this.setState({
        showOpacity: false
      });
    }

    if (nextProps.curFixture) {
      let newMatchStatus = getCurrentMatchStatus(nextProps.curFixture);
      let existingMatchStatus = getCurrentMatchStatus(this.props.curFixture);
      if (
        existingMatchStatus == 0 &&
        this.props.curGameMode == "manageTeam" &&
        newMatchStatus == 1
      ) {
        let msg = returnErrMsg("createTeam", -30);
        this.setState({
          isToastVisible: true,
          swipetoastHead: msg,
          swipetoastDesc: null,
          manageTeamBackPress: false,
          saveTeamDisabled: false,
          toastType: "error"
        });
        this.state.shouldComponentUpdateFlag = false;
      }
    }

    if (
      nextProps.liveScoringData &&
      nextProps.liveScoringData != this.props.liveScoringData
    ) {
      let currLiveMtchData =
        nextProps.liveScoringData &&
        getCurrLiveMatchData(nextProps.liveScoringData, nextProps.curFixture);
      let teamdata = JSON.parse(JSON.stringify(nextProps.teamData)); //_.cloneDeep(nextProps.teamData);
      let hasRedCardFlag = false;
      for (var i = 0; i < teamdata.length; i++) {
        let curPlyr = teamdata[i];
        let plyrId, plyrDetails;
        if (curPlyr.removedPlayerID) {
          plyrId = curPlyr.removedPlayerID.Id;
          plyrDetails = curPlyr.removedPlayerID;
        } else {
          plyrId = curPlyr.plyrId;
          plyrDetails = curPlyr.plyrDetails;
        }
        let hasRedCard = checkLiveRedCard(
          currLiveMtchData,
          plyrId,
          plyrDetails
        );
        if (hasRedCard && curPlyr.removedPlayerID && !curPlyr.hasRedCard) {
          curPlyr.plyrId = curPlyr.removedPlayerID.Id;
          curPlyr.plyrDetails = curPlyr.removedPlayerID;
          curPlyr.isRemovable = false;
          hasRedCardFlag = true;
          curPlyr.hasRedCard = true;
        } else if (
          hasRedCard &&
          !curPlyr.hasRedCard /* && curPlyr.isRemovable == true*/
        ) {
          curPlyr.isRemovable = false;
          curPlyr.hasRedCard = true;
          hasRedCardFlag = true;
        }
      }
      if (hasRedCardFlag) {
        this.props.triggerCreateTeamDataFromCache(teamdata);
      }
    }
  }

  // shouldComponentUpdate() {
  //   if (this.state.shouldComponentUpdateFlag) {
  //     return true;
  //   }
  //   else {

  //     //return false;
  //   }
  // }

  componentDidUpdate() {
    if (this.state.isToastVisible) {
      Animated.timing(this.state.toastLayer, {
        toValue: 0,
        duration: 300
      }).start();
    } else {
      Animated.timing(this.state.toastLayer, {
        toValue: -95,
        duration: 300,
        delay: 100
      }).start();
    }

    if (this.props.playersArray.length && this.state.isFirstTimeRender) {
      this.state.isFirstTimeRender = false;
      Animated.timing(this.state.bottomPlayerListView, {
        toValue: 0,
        duration: 500,
        delay: 500
      }).start();
    }

    if (hasEmptySlot(this.props.teamData)) {
      if (this.props.curGameMode == "createTeam") {
        Animated.timing(this.state.contBottom, {
          toValue: 0,
          duration: 300
        }).start();
      } else {
        if (
          !checkDifference(this.props.oldTeamData, this.props.teamData).length
        ) {
          Animated.timing(this.state.managecontBottom, {
            toValue: -100,
            duration: 300
          }).start();
        }
      }
    } else {
      if (this.props.curGameMode == "createTeam") {
        Animated.timing(this.state.contBottom, {
          toValue: -100,
          duration: 300
        }).start();
      } else {
        Animated.timing(this.state.managecontBottom, {
          toValue: 0,
          duration: 300
        }).start();
      }
    }
  }

  componentWillUnmount() {
    //this.props.emptyPlayers();
    if (
      this.props.curGameMode == "manageTeam" &&
      !hasEmptySlot(this.props.teamData)
    ) {
      this.props.triggerResetTeam(this.props.oldTeamData);
    }
    if (this.props.curGameMode == "createTeam") {
      this.props.resetCurFixture();
    }
    this.props.triggerFilterReset();
  }

  cachePlayerData(response, parentPayload) {
    this.props.triggerCachePlayerData(response, parentPayload);
  }

  filterClick = () => {
    if (this.state.saveTeamDisabled) return true;
    this.setState({
      isFilterModalVisible: !this.state.isFilterModalVisible
    });
  };

  sortClick = () => {
    if (this.state.saveTeamDisabled) return true;
    this.setState({
      isSortModalVisible: !this.state.isSortModalVisible
    });
  };
  async handleContinueClick(response, data) {
    // this.callSaveTeamPage();
    this.props.saveOldTeamData(this.props.teamData);
    if (response && response.Value.tempCookies) {
      //  setAsyncItem(
      //     "cookie",
      //     response.Value.tempCookies[0]
      //   ).then(() => {
      //     chkLoginStatus();
      //     this.callSaveTeamPage();

      //   });
      chkLoginStatus(response.Value.tempCookies[0]);
      this.callSaveTeamPage();
      // let val = await getAsyncItem("cookie");
      // this.props.setAnonymousCookie(val);
    }
  }

  handleErrMessage(response, data) {
    let msg = returnErrMsg("createTeam", response.Meta.RetVal);
    if (response.Meta.RetVal == -30) {
      this.state.shouldComponentUpdateFlag = false;
    }
    this.setState({
      isToastVisible: true,
      swipetoastHead: msg,
      swipetoastDesc: null,
      manageTeamBackPress: false,
      saveTeamDisabled: false,
      toastType: "error"
    });
  }

  addRemovePlayer = (plyr, curGameMode) => {
    if (this.state.saveTeamDisabled) return true;
    let self = this;
    if (chkToastMsg(plyr.Id, this.props.teamData)) {
      this.setState({
        isToastVisible: true,
        swipetoastHead: this.props.translations.plyr_per_match,
        swipetoastDesc: this.props.translations.plyr_per_match_desc,
        toastType: "error"
      });
    } else {
      this.props.triggerAddRemovePlyr(
        plyr,
        this.props.teamData,
        this.props.curGameMode,
        this.props.liveScoringData,
        this.props.curFixture
      );
      if (this.props.curGameMode == "createTeam")
        this.props.triggerCacheTeamData(
          plyr,
          this.props.curFixture.MID,
          this.props.curFixture
        );
    }
  };
  handlePlayerList(filter) {
    self = this;
    this.props.playerPositionFilter({
      skillId: filter,
      teamId: null
    });
    this.props.triggerPlayerListLayer();
    this.props.curPosFilter;
  }
  handlePopupLayer() {
    if (this.state.isFilterPopupVisible) {
      this.filterLayerSlideAnimation(1, 0, this.triggerFilter);
    } else {
      this.filterLayerSlideAnimation(0, 1);
      this.triggerFilter();
    }
  }

  triggerFilter() {
    //this.props.triggerFilterPopupLayer();
    this.setState({
      isFilterPopupVisible: !this.state.isFilterPopupVisible
    });
  }

  handleFilterReset() {
    this.props.triggerFilterReset();
  }
  filterLayerSlideAnimation(from, to, cb) {
    Animated.timing(this.state.opacity, {
      toValue: 0.1,
      duration: 375
    }).start();

    this.state.slideAnimation.setValue(from);
    const createAnimation = function(value, duration, easing, delay = 0) {
      return Animated.timing(value, {
        toValue: to,
        duration,
        easing,
        delay
      });
    };
    Animated.parallel([
      createAnimation(this.state.slideAnimation, 300, Easing.linear, 100)
    ]).start(event => event.finished && cb && cb());
  }

  setTeamFilter(type, index) {
    this.props.triggerFilterSortOptions(type, index);
  }

  async handleCreateTeamPost() {
    track.event("/next", null);
    if (this.state.saveTeamDisabled) return true;
    this.setState({
      saveTeamDisabled: true
    });
    let teamDiff = checkDifference(this.props.oldTeamData, this.props.teamData);
    //if (this.props.oldTeamData.length == 0) {
    let data = {
      GamedayId: this.props.curFixture.GDID,
      MatchdayId: this.props.currMDID,
      LanguageId: this.props.curLang,
      MatchId: this.props.curFixture.MID
    };
    let postObj = getCreateTeamData(this.props.teamData, data);
    // let val = await getAsyncItem("cookie");
    let guid = global.isLoggedIn ? global.SI_Cookie.guid : 0;
    this.props.triggerCreateTeamPost(
      "gameplay/user/" + guid + "/team",
      postObj,
      this.handleContinueClick,
      {},
      this.handleErrMessage
    );
    //}
    // else if (teamDiff.length > 0) {
    //   this.handleSaveTeam(this.handleContinueClick);
    // } else {
    //   this.handleContinueClick();
    // }
  }

  handleResetTeam() {
    if (this.state.saveTeamDisabled) return true;
    this.props.triggerResetTeam(this.props.oldTeamData);
  }

  async handleSaveTeam(callback) {
    track.event("/save", null);
    if (this.state.saveTeamDisabled) return true;
    this.setState({
      saveTeamDisabled: true
    });
    let UserTeamPlayerTrans = getTransferredPlyrs(
      this.props.oldTeamData,
      this.props.teamData
    );

    let currGameStatus = getCurrentMatchStatus(this.props.curFixture);
    if (UserTeamPlayerTrans.length) {
      global.UserTeamPlayerTrans = UserTeamPlayerTrans;
      let data = {
        UserTeamPlayerTrans,
        GamedayId: this.props.curFixture.GDID,
        MatchdayId: this.props.currMDID,
        LanguageId: this.props.curLang,
        MatchId: this.props.curFixture.MID,
        IsSubstitution: currGameStatus == 1 ? 1 : 0
      };
      let postObj = getCreateTeamData(this.props.teamData, data);
      // let val = await getAsyncItem("cookie");
      let guid = global.isLoggedIn ? global.SI_Cookie.guid : 0;

      // let guid = val && val.UCLLM_FAN ? convertCookies(val.UCLLM_FAN).guid : 0;
      let successCallback = this.callSummaryPage;
      this.props.triggerCreateTeamPost(
        "gameplay/user/" + guid + "/transfer",
        postObj,
        successCallback,
        {},
        this.handleErrMessage
      );
    }
    // else {
    //   this.callSaveTeamPage();
    // }
  }

  callSummaryPage(response, data) {
    // will take user to summary page
    // getAsyncItem("cookie").then(val => {
    //   this.callApi(val);
    // });
    let currGameStatus = getCurrentMatchStatus(this.props.curFixture);

    if (currGameStatus == 1) {
      this.props.triggerStartSubstitution(true);
    }

    this.callApi();
    this.onCreateTeamBackPressed(true, response.Value.userTeamPlayers);
  }

  async callSaveTeamPage() {
    // getAsyncItem("cookie").then(val => {
    if (global.isLoggedIn && !global.isGuest) {
      //will take user to all matches
      this.onCreateTeamBackPressed(true);
    } else {
      this.setState({
        saveTeamDisabled: false
      });
      setCurScreen("SaveTeam");

      //   Navigator.push(
      //   "Games/"+global.gameId+"/SaveTeam",
      // )

      this.props.navigation.navigate({
        key: "SaveTeam",
        routeName: "SaveTeam"
      });
    }

    if (global.isLoggedIn) {
      this.callApi();
    }
    //});
  }

  callApi(val) {
    let guid = global.SI_Cookie.guid;
    this.props.triggerGetTeamData(
      this.props.curFixture.GDID,
      guid,
      {},
      this.props.createTeamBuster
    );
    this.props.getUserPlayedGames(
      this.props.currMDID,
      guid,
      {},
      this.props.createTeamBuster
    );
  }

  onDiscardPress = () => {
    this.props.triggerResetTeam(this.props.oldTeamData);
    this.onCreateTeamBackPressed();
  };

  onToastOkPress() {
    if (!this.state.shouldComponentUpdateFlag) {
      this.onCreateTeamBackPressed();
    }
    this.setState({
      isToastVisible: false,
      isFirstTimeError: false,
      manageTeamBackPress: false
    });
  }

  renderToastPopup(
    toastLayerInterpolate,
    toastLayerBackgroundColor,
    enableSaveFlag
  ) {
    if (this.state.isToastVisible) {
      if (this.state.manageTeamBackPress) {
        return (
          <DrawerPopup
            toastLayerInterpolate={toastLayerInterpolate}
            buttonType="Long"
            isModalVisible={this.state.isToastVisible}
            onCancelPress={this.onDiscardPress}
            onPress={this.onToastOkPress.bind(this)}
            onGradientPress={{ enableSaveFlag } && this.handleSaveTeam}
            simpleButtonTxt={this.props.translations.dismiss_changes}
            gradientButtonTxt={this.props.translations.save}
            toastHeading={this.props.translations.toastSaveTeamDesc}
            toastDesc={this.props.translations.save_team_toast_desc}
            translations={this.props.translations}
          />
        );
      } else {
        return (
          <SwipeableToast
            isErrorVisible={this.state.isToastVisible}
            onCloseClick={this.onToastOkPress.bind(this)}
            toastHeading={this.state.swipetoastHead}
            toastType={this.state.toastType}

            //toastDesc={this.state.swipetoastDesc}
          />
        );
      }
    }
  }

  onCloseAllToastClick = obj => {
    var newObj = obj ? obj : [];
    this.props.clearMultiToastMsg(newObj);
  };

  render() {
    if (this.props.teamData.length == 0)
      return (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="#f39200" />
        </View>
      );

    let self = this;
    let currGameStatus = getCurrentMatchStatus(this.props.curFixture);
    let currLiveMtchData =
      this.props.liveScoringData &&
      getCurrLiveMatchData(this.props.liveScoringData, this.props.curFixture);

    const filterLayerPosition = this.state.slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["-100%", "0%"]
    });

    const playerListPos = this.state.slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "48%"]
    });

    const animatedBackgroundColor = this.state.slideAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ["rgba(0, 0, 0,0)", "rgba(0, 0, 0, .6)"]
    });
    if (this.props.playersArray.length) {
      var bottomPlayerListViewInterpolate = this.state.bottomPlayerListView.interpolate(
        {
          inputRange: [-95, 0],
          outputRange: ["-95%", "0%"]
        }
      );
    }

    const toastLayerInterpolate = this.state.toastLayer.interpolate({
      inputRange: [-95, 0],
      outputRange: ["-100%", "0%"]
    });

    const toastLayerBackgroundColor = this.state.slideAnimation.interpolate({
      inputRange: [-95, 1],
      outputRange: ["rgba(0, 0, 0,0)", "rgba(0, 0, 0, .6)"]
    });

    let curFixture = this.props.curFixture;
    let filterModal = this.state.isFilterModalVisible
      ? this.filterModalMkp()
      : null;
    let resetModal = this.state.isSortModalVisible ? this.sortModalMkp() : null;

    let sortByObj = _.filter(this.props.sortByKeys, function(item) {
      return item.id == self.props.sortBy;
    });

    let saveActiveClass = [];
    let enableSaveFlag =
      hasEmptySlot(this.props.teamData) &&
      checkDifference(this.props.oldTeamData, this.props.teamData).length;
    if (enableSaveFlag) {
      saveActiveClass.push(commonStyles.active);
    }
    let subsPending = this.props.subsPending;

    if (global.curScreen == "CreateTeam") {
      this.state.showMultiToastFlag = true;
    } else {
      this.state.showMultiToastFlag = false;
    }
    return (
      <View style={styles.container}>
        <BgImageContainer showMultiToastFlag={this.state.showMultiToastFlag}>
          {this.props.visiblePlayerDetails ? (
            <PlayerDetailModal
              curFixture={this.props.curFixture}
              addRemovePlayer={this.addRemovePlayer}
              showPlayerPopup={this.showPlayerPopup}
              teamData={this.props.teamData}
              currGameStatus={currGameStatus}
              showBtns={true}
              allPlyrObj={this.props.allPlyrObj}
              currLiveMtchData={currLiveMtchData}
              skillShort={this.props.skillShort}
              toastMsgteam={this.props.toastMsgteam}
              completePlayersObj={this.props.completePlayersObj}
            />
          ) : null}
          <Header
            navigation={this.props.navigation}
            curFixture={curFixture}
            enableSaveFlag={enableSaveFlag}
            translations={this.props.translations}
            currGameStatus={currGameStatus}
            renderToastPopup={this.renderToastPopup}
            curGameMode={this.props.curGameMode}
            onCreateTeamBackPressed={this.onCreateTeamBackPressed}
            closeModal={this.closeModal.bind(this)}
            currLiveMtchData={currLiveMtchData}
            serverDate={this.props.serverDate}
          />
          <View
            style={
              this.state.isFilterPopupVisible
                ? { display: "flex", opacity: 0 }
                : styles.createTeamCont
            }
          >
            {this.props.curGameMode == "createTeam" &&
            this.props.HasFourTeams ? (
              <View style={styles.createHeadWithoutName} />
            ) : (
              <View style={styles.createHead}>
                <MyText
                  letterSpacing={3}
                  wordSpacing={10}
                  textAlign="center"
                  style={[styles.text, styles.headText]}
                >
                  {currGameStatus == 1 && this.props.curGameMode == "manageTeam"
                    ? subsPending > 0
                      ? subsPending == 1
                        ? subsPending + " " + this.props.translations.sub_left
                        : subsPending + " " + this.props.translations.subs_left
                      : this.props.translations.no_sub_left
                    : this.props.curGameMode == "createTeam"
                    ? this.props.HasFourTeams
                      ? ""
                      : this.props.translations.pick_players
                      ? this.props.translations.pick_players
                      : "PICK ANY 3 PLAYERS"
                    : this.props.translations.manageTeamTxt}
                </MyText>
              </View>
            )}
            <View style={styles.boxContainer}>
              <View style={styles.boxRow}>
                {this.props.teamData.map(function(item, index) {
                  let hasRedCard = "";
                  if (currGameStatus == 1 || currGameStatus == 2) {
                    let plyrId, plyrDetails;
                    if (item.removedPlayerID) {
                      plyrId = item.removedPlayerID.Id;
                      plyrDetails = item.removedPlayerID;
                    } else {
                      plyrId = item.plyrId;
                      plyrDetails = item.plyrDetails;
                    }
                    hasRedCard = checkLiveRedCard(
                      currLiveMtchData,
                      plyrId,
                      plyrDetails
                    );
                  }

                  return (
                    <SVGImageShape
                      key={index}
                      data={item}
                      translations={self.props.translations}
                      curGameMode={self.props.curGameMode}
                      curLang={self.props.curLang}
                      skillShort={self.props.skillShort}
                      addRemovePlayer={self.addRemovePlayer}
                      showRemove={true}
                      teamData={self.props.teamData}
                      triggerPlayerDetailModal={
                        self.props.triggerPlayerDetailModal
                      }
                      currGameStatus={currGameStatus}
                      currLiveMtchData={currLiveMtchData}
                      currentScreen={"CreateTeam"}
                      hasRedCard={hasRedCard}
                      toastMsgteam={self.props.toastMsgteam}
                    />
                  );
                })}
              </View>
            </View>
            {/* {this.state.toastMsg} */}
          </View>

          <Animated.View
            style={[{ flex: 0.95, bottom: bottomPlayerListViewInterpolate }]} //, bottom: bottomPlayerListViewInterpolate }]}
          >
            {this.props.playersArray.length ? (
              <Animated.View
                style={{
                  ...(this.state.isFilterPopupVisible
                    ? {
                        width: "100%",
                        height: screenHeight == 812 ? "85%" : "95%",
                        position: "absolute",
                        zIndex: 5,

                        backgroundColor: "transparent",
                        bottom: playerListPos
                      }
                    : {
                        width: "100%",
                        height: "95%",
                        zIndex: 5,
                        position: "absolute",
                        backgroundColor: "transparent",
                        bottom: playerListPos
                      }),
                  zIndex: 12
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    zIndex: 40,
                    backgroundColor: "transparent"
                  }}
                >
                  <View style={styles.mainPlyrList}>
                    <PlayerListLayerHeader
                      handleFilterPopupLayer={this.handlePopupLayer}
                      handlePlayerListLayer={() =>
                        this.props.triggerPlayerListLayer(false)
                      }
                      curFixture={this.props.curFixture}
                      setTeamFilter={this.setTeamFilter}
                      currPosSelected={this.props.currPosSelected}
                      defaultTeamId={this.props.defaultTeamId}
                      translations={this.props.translations}
                    />
                    <View style={[styles.middleBorderLineWrp]}>
                      <View style={[styles.middleBorderLine]} />
                    </View>
                    <PlayerListLayer
                      triggerPlayerDetailModal={
                        this.props.triggerPlayerDetailModal
                      }
                      triggerFetchPlayerDetailsCard={
                        this.props.triggerFetchPlayerDetailsCard
                      }
                      selectedPlayer={this.state.selectedPlayer}
                      toggleMe={this.handlePlayerList}
                      handlePopupLayer={this.handlePopupLayer}
                      addPlayer={this.addRemovePlayer}
                      showOpacity={this.state.showOpacity}
                      plyrCannotSelected={this.props.plyrCannotSelected}
                      currLiveMtchData={currLiveMtchData}
                      toastMsgteam={this.props.toastMsgteam}
                      currGameStatus={currGameStatus}
                    />
                  </View>
                </View>
              </Animated.View>
            ) : null}
          </Animated.View>

          {this.props.curGameMode == "createTeam" ? (
            <View>
              <Animated.View
                style={[{ bottom: this.state.contBottom }, styles.nextMainCont]}
              >
                <Image
                  style={styles.nxtBtnImage}
                  resizeMode="stretch"
                  source={require("../images/Next_button_BG.png")}
                />
                <TouchableWithoutFeedback onPress={this.handleCreateTeamPost}>
                  <View
                    style={
                      this.state.saveTeamDisabled
                        ? [styles.nextCont, commonStyles.disabled]
                        : [styles.nextCont]
                    }
                  >
                    <GradientButton
                      buttonText={
                        this.props.translations.save
                          ? this.props.translations.save
                          : "SAVE"
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
              </Animated.View>
            </View>
          ) : null}
          {this.props.curGameMode == "manageTeam" ? (
            <View>
              <Animated.View
                style={[
                  { bottom: this.state.managecontBottom },
                  styles.nextMainCont,
                  styles.manageNextCont
                ]}
              >
                <Image
                  style={styles.nxtBtnImage}
                  resizeMode="stretch"
                  source={require("../images/Next_button_BG.png")}
                />
                <View style={styles.buttonWrp}>
                  <TouchableWithoutFeedback onPress={this.handleResetTeam}>
                    <View
                      style={
                        this.state.saveTeamDisabled
                          ? [styles.simpleButtonCont, commonStyles.disabled]
                          : [styles.simpleButtonCont]
                      }
                    >
                      <MyText
                        letterSpacing={3}
                        wordSpacing={10}
                        textAlign="center"
                        style={styles.simpleButtonTxt}
                      >
                        {this.props.translations.cancel_btn
                          ? this.props.translations.cancel_btn
                          : "CANCEL"}
                      </MyText>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={enableSaveFlag && this.handleSaveTeam}
                  >
                    <LinearGradient
                      style={[
                        this.state.saveTeamDisabled
                          ? [styles.grdButton, commonStyles.disabled]
                          : [styles.grdButton]
                      ]}
                      colors={
                        enableSaveFlag
                          ? ["#e14dff", "#4f66ea"]
                          : ["#afb6bc", "#afb6bc"]
                      }
                      start={
                        Platform.OS === "ios"
                          ? { x: 0.0, y: 0.5 }
                          : { x: -0.6, y: 0.7 }
                      }
                      end={
                        Platform.OS === "ios"
                          ? { x: 1, y: 0.5 }
                          : { x: 1.2, y: 0.7 }
                      }
                      // locations={[-0.7, 1.0]}
                    >
                      <MyText
                        letterSpacing={3}
                        wordSpacing={10}
                        textAlign="center"
                        style={styles.nextTxt}
                      >
                        {this.props.translations.save
                          ? this.props.translations.save.toUpperCase()
                          : "SAVE"}
                      </MyText>
                    </LinearGradient>
                  </TouchableWithoutFeedback>
                </View>
              </Animated.View>
            </View>
          ) : null}

          {this.renderToastPopup(
            toastLayerInterpolate,
            toastLayerBackgroundColor,
            enableSaveFlag
          )}
        </BgImageContainer>
        <Animated.View
          style={{
            width: "100%",
            height: "100%",
            zIndex: 60,
            position: "absolute",
            backgroundColor: animatedBackgroundColor,
            display: this.state.isFilterPopupVisible ? "flex" : "none",
            bottom: filterLayerPosition
          }}
        >
          {this.props.playersArray.length ? (
            <Animated.View
              style={{
                width: "100%",
                bottom: filterLayerPosition,
                height: "100%",
                zIndex: 60,
                position: "absolute"
              }}
            >
              <TouchableWithoutFeedback onPress={this.handlePopupLayer}>
                <Animated.View
                  style={{
                    flex: 0.7
                  }}
                />
              </TouchableWithoutFeedback>
              <View style={{ flex: 1 }}>
                <Image
                  resizeMode="stretch"
                  source={filterLayerBackground}
                  style={styles.playerListBackground}
                />
                <FilterPopupLayer
                  visible={this.state.isFilterPopupVisible}
                  handlePopup={this.handlePopupLayer}
                  sortByArr={this.props.sortByKeys}
                  trans={this.props.translations}
                  teamsList={this.props.teamsList}
                  defaultTeamId={this.props.defaultTeamId}
                  setTeamFilter={this.setTeamFilter}
                  skillShort={this.props.skillShort}
                  currPosSelected={this.props.currPosSelected}
                  handleFilterReset={this.handleFilterReset}
                />
              </View>
            </Animated.View>
          ) : null}
        </Animated.View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  playerListBackground: {
    backgroundColor: "transparent",
    flex: 1,
    //resizeMode: 'stretch',
    position: "absolute",
    width: "100%",
    //height: '100%',
    top: 0,
    justifyContent: "center"
  },

  buttonWrp: {
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: screenHeight === 812 ? 0 : 18,
    width: "100%",
    flexDirection: "row"
  },
  nextCont: {
    // backgroundColor: "#ff16ff",
    width: "100%",
    marginTop: screenHeight === 812 ? 0 : 18,
    alignItems: "center",
    justifyContent: "center",
    // borderColor: 'yellow',
    // borderWidth: 1,
    flex: 1
  },
  borderGrdButtonCont: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgb(79, 102, 234)",
    width: "48%",
    height: 50,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",

    "@media (max-width: 320)": {}
  },

  borderGrdButtonTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: "#a956f7",
    letterSpacing: 3,
    lineHeight: 16
  },

  simpleButtonCont: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ffffff",
    width: "48%",
    height: 50,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a956f7",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5,
    shadowOpacity: 0.6,
    // marginTop: 10,
    "@media (max-width: 320)": {
      // padding: 12,
      // marginTop: 12
    }
  },
  grdButton: {
    width: "48%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#a956f7",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5,
    shadowOpacity: 0.6
  },
  splBtnWithGradientTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 3,
    lineHeight: 16
  },
  saveCont: {
    backgroundColor: "#ff16ff",
    width: "48%",
    padding: 12,
    alignItems: "center",
    marginTop: 10,
    "@media (max-width: 320)": {
      padding: 12,
      marginTop: 12
    },
    opacity: 0.5
  },
  simpleButtonTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 3,
    lineHeight: 16
  },
  nextTxt: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
    letterSpacing: 3,
    lineHeight: 16
  },
  nxtBtnImage: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    height: screenHeight == 812 ? 120 : 100,
    "@media (max-width: 320)": {
      height: 90
    }
  },
  mainPlyrList: {
    flex: 1,
    width: "100%",
    // marginHorizontal: 16,
    overflow: "hidden",
    // borderColor: 'yellow',
    // borderWidth: 1,
    flexDirection: "column",
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'red',
    //marginTop: this.state.isFilterPopupVisible ? 15 : 1,
    "@media (max-width: 320)": {
      // marginHorizontal: 13
    },
    ...Platform.select({
      android: {
        //marginHorizontal: 14
        // marginHorizontal: 16.5
      }
    })
  },
  middleBorderLineWrp: {
    // marginHorizontal: 15,

    ...Platform.select({
      android: {
        // marginHorizontal: 14.5
      }
    })
  },
  middleBorderLine: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, .2)",
    ...Platform.select({
      android: {
        // width: '98%',
        // left: 4
      }
    })
  },
  upArrow: {
    width: 25,
    height: 25,
    left: "60%"
  },
  createTeamCont: {
    position: "relative",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  },
  toastBox: {
    position: "absolute",
    width: 280,
    top: 80,
    left: Dimensions.get("window").width / 2 - 140,
    right: 0
  },
  toastCont: {
    padding: 20,
    alignSelf: "center",
    backgroundColor: "#fff"
  },

  loaderWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "#000"
  },
  teamBadge: {
    width: 15,
    height: 15,
    position: "absolute",
    zIndex: 5,
    bottom: 0
  },
  topMainStrip: {},
  listItemWrapper: {
    flexDirection: "row",
    flex: 1,
    height: 50,
    marginBottom: 5,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.22)"
  },
  listItemWrapperActive: {
    backgroundColor: "#feeed6",
    borderColor: "#f39200",
    borderWidth: 2
  },
  imageWrapper: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,.1)",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    backgroundColor: "transparent",
    borderRadius: 20,
    overflow: "hidden"
  },
  container: {
    flex: 1
  },
  text: {
    alignItems: "center",
    justifyContent: "center",
    color: "$primaryTextWhite",
    fontSize: 17,
    letterSpacing: 3
  },
  mainBgImage: {
    width: screenWidth,
    flex: 1
  },
  teamversus: {
    height: 60,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    "@media (max-width: 360)": {
      height: 40
    }
  },
  teamNameCont: {
    width: "40%",
    height: 30,
    flexDirection: "row",
    alignItems: "center"
  },
  timeCont: {
    width: "20%",
    height: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  teamA: {
    justifyContent: "flex-end"
  },
  teamTxt: {
    color: "white"
  },
  flagImage: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginRight: 5
  },
  createHead: {
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: 10,
    marginVertical: 8,
    "@media (max-width: 360)": {
      height: 35,
      marginVertical: 4
    }
  },

  createHeadWithoutName: {
    marginVertical: 12
  },
  // headText: {
  //   fontSize: 16
  // },
  headText: {
    color: COLORS.WHITE,
    fontSize: 17,
    fontFamily: "Champions-Bold",
    letterSpacing: 3,
    lineHeight: 16,
    textAlign: "center"
  },
  boxContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  boxRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden"
    // borderWidth: 1,
    // borderColor: "red"
  },

  innerBoxRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10
    // marginHorizontal: 10,
    // borderWidth: 1,
    // borderColor: 'white'
  },

  filterCont: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 10,
    "@media (max-width: 360)": {
      paddingTop: 10
    }
  },
  filterRow: {
    width: "95%",
    height: 30,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  filterBox: {
    width: "48%",
    height: 30,
    borderWidth: 1,
    borderColor: "#c9c9c9",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10
  },
  filterText: {
    fontSize: 14
  },
  arrowIcon: {
    width: 25,
    height: 10.7
  },
  playerListCont: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 3,
    paddingBottom: 3
  },
  playerListHeadCont: {
    marginLeft: 8,
    flexDirection: "row",
    width: "95%",
    borderBottomWidth: 1,
    borderBottomColor: "#979797",
    paddingBottom: 5,
    paddingLeft: 8
  },
  nameHead: {
    width: "70%"
  },
  filterBoxWrap: {
    height: 220,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#f39200",
    backgroundColor: "#ffffff"
  },
  sortBoxWrap: {
    height: 288,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#f39200",
    backgroundColor: "#ffffff"
  },
  filterHeadWrap: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 35,
    backgroundColor: "#efefef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  closeImage: {
    width: 11,
    height: 11
  },
  // filterHeadText: {
  //   color: "#272727",
  //   fontSize: 16
  // },
  filterBodyWrap: {
    padding: 10
  },
  teamText: {
    color: "#272727",
    marginBottom: 10
  },
  filterWrap: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  closeBox: {
    padding: 10,
    paddingRight: 0
  },
  filterData: {
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#727272",
    borderWidth: 1,
    padding: 10
  },
  filterByTeamWrap: {
    paddingBottom: 15,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  filterByPosWrap: {
    paddingTop: 15
  },
  posFilterData: {
    width: "22%"
  },

  teamA: {
    justifyContent: "flex-end"
  },
  teamTxt: {
    color: "white"
  },
  flagImage: {
    width: 20,
    height: 20,
    marginLeft: 5,
    marginRight: 5
  },
  // createHead: {
  //   height: 38,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginBottom: 10
  // },
  // headText: {
  //   fontSize: 16
  // },
  // boxContainer: {
  //   flexDirection: "row",
  //   justifyContent: "center"
  // },

  // boxRow: {
  //   width: "85%",
  //   flexDirection: "row",
  //   justifyContent: "space-between"
  // },

  filterCont: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 10
  },
  filterRow: {
    width: "95%",
    height: 30,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  filterBox: {
    width: "48%",
    height: 30,
    borderWidth: 1,
    borderColor: "#c9c9c9",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10
  },
  filterText: {
    fontSize: 14
  },
  arrowIcon: {
    width: 25,
    height: 10.7
  },
  playerListCont: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 3,
    paddingBottom: 3
  },
  playerListHeadCont: {
    flexDirection: "row",
    width: "95%",
    borderBottomWidth: 1,
    borderBottomColor: "#979797",
    paddingBottom: 5
  },
  nameHead: {
    flex: 0.7
  },
  filterBoxWrap: {
    height: 220,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#f39200",
    backgroundColor: "#ffffff"
  },
  sortBoxWrap: {
    height: 288,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#f39200",
    backgroundColor: "#ffffff"
  },
  filterHeadWrap: {
    paddingLeft: 10,
    paddingRight: 10,
    height: 35,
    backgroundColor: "#efefef",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  closeImage: {
    width: 11,
    height: 11
  },
  filterHeadText: {
    color: "#272727",
    fontSize: 16
  },
  filterBodyWrap: {
    padding: 10
  },
  teamText: {
    color: "#272727",
    marginBottom: 10
  },
  filterWrap: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  closeBox: {
    padding: 10,
    paddingRight: 0
  },
  filterData: {
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#727272",
    borderWidth: 1,
    padding: 10
  },
  filterByTeamWrap: {
    paddingBottom: 15,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1
  },
  filterByPosWrap: {
    paddingTop: 15
  },
  posFilterData: {
    width: "22%"
  },
  sortBodyWrap: {
    paddingTop: 0
  },
  nameText: {
    fontSize: 16,
    color: "#575d41"
  },
  selHead: {
    flex: 0.12,
    alignItems: "center"
  },
  contBtnWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    marginTop: 10,
    "@media (max-width: 360)": {
      height: 45,
      marginTop: 8
    }
    //flex:0.1,
  },
  contBtn: {
    flex: 1,
    backgroundColor: "#afb6bc",
    borderRadius: 2,
    width: "90%",
    alignItems: "center",
    justifyContent: "center"
  },
  contText: {
    fontSize: 16
  },
  contBtnActive: {
    backgroundColor: "#f39200"
  },

  //new css
  Container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
    // alignItems: 'center'
  },
  mainBg: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  navbarWrp: {
    // borderColor:'red',
    // borderWidth:1,
    flex: 0.08,
    flexDirection: "row",
    marginTop: 15
  },
  mainnavWrp: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 5
  },
  backBtnWrp: {
    flex: 0.1,
    paddingHorizontal: 4,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center"
  },
  backArrow: {
    color: COLORS.WHITE,
    fontSize: 22
  },
  moreMenuIcon: {
    color: COLORS.WHITE,
    fontSize: 22
  },
  teamWrp: {
    flex: 0.8
    // borderColor:'red',
    // borderWidth:1,
  },
  toggleBtn: {
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center"
    // borderColor: "red",
    // borderWidth: 1
  },
  moreIcon: {
    // paddingRight: 15
  },
  matchDetWrp: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  matchTeamDet: {
    flex: 0.8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  matchDetTeamA: {},
  TeamAName: {
    flex: 0.8
    // borderColor:'red',
    // borderWidth:1,
  },
  TeamBName: {
    flex: 0.8
    // borderColor:'red',
    // borderWidth:1,
  },
  TeamNameLeft: {
    color: "white",
    fontWeight: "normal",
    fontSize: 14,
    textAlign: "right"
  },
  TeamNameRight: {
    color: "white",
    fontWeight: "normal",
    fontSize: 14
  },
  TopTeamLogo: {
    flex: 0.2,
    // borderColor:'black',
    // borderWidth:1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
  },
  teamLogo: {
    width: 25,
    height: 25,
    "@media (max-width: 374)": {
      width: 22,
      height: 22
    }
  },
  matchTD: {
    // borderColor:'red',
    // borderWidth:1,
    justifyContent: "center",
    alignItems: "center"
  },
  matchDate: {
    fontSize: 14,
    fontWeight: "normal",
    color: COLORS.WHITE
  },
  matchTime: {
    fontSize: 13,
    fontWeight: "normal",
    color: "rgba(255,255,255,0.5)"
  },

  plyDisWrp: {
    flex: 0.3,
    width: "100%"
    // borderColor:'red',
    // borderWidth:1,
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  mainPlyDis: {
    flex: 1,
    flexDirection: "column"
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  titleSelection: {
    flex: 0.2,
    // borderColor:'red',
    // borderWidth:1,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center"
  },
  pickPlyTitle: {
    color: COLORS.WHITE,
    fontSize: 17,
    fontFamily: "Champions-Bold",
    letterSpacing: 3,
    lineHeight: 16,
    textAlign: "center"
  },
  plySlotsWrp: {
    flex: 0.8,
    // borderColor:'red',
    // borderWidth:1,
    justifyContent: "center",
    alignItems: "center"
  },
  plySlotsInnerWrp: {
    flex: 1,
    // borderColor:'white',
    // borderWidth:1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  plyVisiblePolygonWrp: {
    flex: 0.33,
    marginHorizontal: 3
    // borderColor:'white',
    // borderWidth:1,
  },
  plyVisiblePolygon: {
    flex: 1,
    // borderColor:'white',
    // borderWidth:1,
    flexDirection: "column"
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  plyPolygon: {
    flex: 0.8,
    height: 110,
    borderColor: COLORS.LM_SECONDARY_COLOR,
    borderWidth: 1,
    marginBottom: 5
  },

  plyValues: {
    flex: 0.2,
    // borderColor:'white',
    // borderWidth:1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 3
  },

  plySelectedName: {
    color: COLORS.LM_SECONDARY_COLOR,
    fontSize: 13,
    fontWeight: "bold"
  },
  plySelectedPlace: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontFamily: "SF-UI-Text-Medium"
  },

  plyListWrp: {
    // borderColor:'red',
    // borderWidth:1,
    flex: 0.62,
    justifyContent: "center",
    alignItems: "center"
  },
  PlyListingGra: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  paddingTop: {
    paddingTop: "3.5%"
  },
  headerWrp: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    overflow: "hidden",
    borderBottomColor: "rgb(216, 216, 216)",
    borderBottomWidth: 1
    // borderColor:'red',
    // borderWidth:1,
  },

  headerWrpSkew: {
    transform: [{ skewY: "-3.6deg" }],
    marginTop: "3.5%",
    overflow: "hidden",
    flex: 1
    // borderColor:'black',
    // borderWidth:1,
  },
  headerMain: {
    height: 400,
    top: "-3%",
    transform: [{ skewY: "3.6deg" }]
  },
  headerTitleList: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    top: "-3%",
    overflow: "hidden"
  },
  Filters: {
    flex: 0.5,
    height: "100%",
    borderRightColor: "rgb(216, 216, 216)",
    borderRightWidth: 1,
    paddingTop: "10%",
    paddingLeft: "7.5%",
    paddingRight: "2%"
  },
  Filterswrp: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  filtersIcon: {
    fontSize: 28,
    marginHorizontal: 5,
    color: COLORS.LM_LOSSES_COLOR
  },
  FiltersTitle: {
    color: "#2d2828",
    fontSize: 14,
    fontWeight: "normal",
    letterSpacing: 2.33
  },
  teamALogo: {
    flex: 0.25,
    height: "100%",
    borderRightColor: "rgb(216, 216, 216)",
    borderRightWidth: 1,
    alignItems: "center",
    paddingTop: "7.5%"
  },
  teamBLogo: {
    flex: 0.25,
    height: "100%",
    alignItems: "center",
    paddingTop: "7.5%"
  },
  filteamLogo: {
    width: 30,
    height: 30
  },
  plyFilterListWrp: {
    width: "100%",
    flex: 0.8,
    paddingLeft: "4%",
    paddingRight: "4%",
    // borderColor:'red',
    // borderWidth:1,
    overflow: "hidden"
  },
  plyFilterList: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    borderBottomColor: "rgb(216, 216, 216)",
    borderBottomWidth: 1,
    // borderColor:'black',
    // borderWidth:1,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    overflow: "hidden"
  },
  plyListInner: {
    flex: 1,
    flexDirection: "row",
    flexBasis: "100%",
    justifyContent: "center",
    alignItems: "stretch"
  },
  plyImgMain: {
    flexBasis: "18%",
    flexShrink: 0
    // borderColor:'red',
    // borderWidth:1,
  },
  plyImageCon: {
    justifyContent: "center",
    alignItems: "center",
    width: 47,
    height: 47,
    backgroundColor: "rgb(242, 242, 241)",
    borderRadius: 47 / 2,
    overflow: "hidden"
    // borderColor: 'rgba(0,0,0,0.2)',
    // borderWidth: 1,
  },
  plyImage: {
    width: 46,
    height: 46
  },
  plyListDetailsWrp: {
    flexBasis: "52%",
    flexShrink: 0
    // borderColor:'red',
    // borderWidth:1,
    // marginHorizontal:7,
  },
  plyDet: {
    marginLeft: 10,
    flexBasis: "100%",
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "flex-start"
    // borderColor:'red',
    // borderWidth:1,
  },
  plyListName: {
    color: COLORS.LM_PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: "bold"
  },
  plyListTeam: {
    color: COLORS.LM_COMPLEMENTARY_COLOR,
    fontSize: 12
  },
  plyIListPointWrp: {
    flexBasis: "17%",
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "center"
    // borderColor:'red',
    // borderWidth:1,
  },
  plyListPoints: {
    color: COLORS.BLACK,
    fontSize: 30,
    fontFamily: "Champions-Bold",
    "@media (max-width: 374)": {
      fontSize: 25
    }
  },
  plyListInfoWrp: {
    flexBasis: "13%",
    flexShrink: 0,
    justifyContent: "center",
    alignItems: "flex-end"
    // borderColor:'red',
    // borderWidth:1,
  },
  plyListInfborder: {
    width: 26,
    height: 26,
    borderColor: "#c4c4c4",
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    "@media (max-width: 374)": {
      width: 24,
      height: 24
    }
  },
  plyListInfo: {
    color: COLORS.LM_LOSSES_COLOR,
    fontSize: 10
  },
  paddingTop: {
    paddingTop: 15,
    backgroundColor: "red",
    "@media (max-width: 375)": {
      // paddingTop: '0.2%',
    }
  },

  //new toast css
  toastOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 51
  },
  PlayerPerMatchPopup: {
    flex: 1,
    width: "100%",
    // height: 254,
    zIndex: 52,
    position: "absolute",
    bottom: 0,
    // borderColor: 'red',
    // borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    "@media (max-width: 320)": {
      height: 220
    }
  },
  toastPopupBG: {
    flex: 1,
    width: "100%",
    height: "100%",
    // height: 254,
    position: "absolute",
    bottom: 0,
    // borderColor: 'green',
    // borderWidth: 2,
    "@media (max-width: 320)": {
      height: 220
    }
  },
  mainPopupWrp: {
    flex: 1,
    width: "100%",
    height: "100%",
    marginTop: 30,
    paddingHorizontal: 15,
    alignItems: "center",
    // justifyContent: 'center',
    // borderColor: 'red',
    // borderWidth: 1,
    "@media (max-width: 320)": {
      marginTop: 22
    }
  },

  ButtonMainWrp: {
    position: "absolute",
    top: 0,
    right: 15
    // borderColor: 'red',
    // borderWidth: 1
    // justifyContent: "flex-end",
    // alignItems: "flex-end"
  },
  cancelButtonWrp: {
    padding: 5
  },
  cancelButton: {
    fontSize: 14,
    fontWeight: "normal",
    fontStyle: "normal",
    letterSpacing: 2.33,
    textAlign: "right",
    color: "#858484"
  },
  okButtonWrp: {
    borderColor: "rgb(79, 102, 234)",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#e14dff",
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5,
    shadowOpacity: 0.8,
    "@media (max-width: 320)": {
      paddingVertical: 8,
      paddingHorizontal: 25
    }
  },
  okButton: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 3,
    color: "#a956f7",
    "@media (max-width: 320)": {
      fontSize: 12
    }
  },
  messageSlotsWrp: {
    // borderColor: 'blue',
    // borderWidth: 1,
    marginTop: 10
  },
  messageIconImg: {
    width: 64,
    height: 64
    // borderColor: 'blue',
    // borderWidth: 1
  },
  messageIconHint: {
    position: "absolute",
    right: 3,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    width: 21,
    height: 21,
    backgroundColor: "#0566f5",
    borderRadius: 21 / 2,
    overflow: "hidden"
  },
  messageWrp: {
    // borderColor: 'red',
    // borderWidth: 1,
    width: "86%",
    marginTop: 20,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    "@media (max-width: 320)": {
      marginTop: 15
    }
  },
  nextMainCont: {
    width: "100%",
    height: 100,
    zIndex: 50,
    //opacity: this.state.contOpacity,
    position: "absolute",
    left: 0,
    right: 0,
    //bottom: 0,
    // marginBottom: 10,

    // ...Platform.select({
    //   android: {
    //     marginBottom: 22
    //   }
    // }),

    justifyContent: "center",
    alignItems: "center",
    // borderColor: 'red',
    // borderWidth: 1,
    "@media (max-width: 320)": {
      height: 90
      // marginBottom: -5
    }
  },
  ToatsMsgHeadingWrp: {
    marginBottom: 20,
    "@media (max-width: 320)": {
      marginBottom: 15
    }
  },
  ToatsMsgHeading: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0,
    color: "#0e0e52",
    "@media (max-width: 320)": {
      fontSize: 15
    }
  },
  ToastMsgDesWrp: {
    alignItems: "center",
    justifyContent: "center"
  },
  ToastMsgDescription: {
    marginBottom: 20,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
    color: "#2d2828",
    textAlign: "center",
    "@media (max-width: 320)": {
      fontSize: 12,
      marginBottom: 7
    }
  }
});
function mapStateToProps(state, props) {
  let {
    translations,
    cachedPlayerData,
    curLang,
    cachedTeamData,
    cookie,
    currMDID,
    createTeamBuster,
    toastMsgteam,
    HasFourTeams
  } = state.TeamDataReducer;
  let { loading, serverDate } = state.AllMatchesReducer;
  let { multiToastMsg } = state.ToastReducer;

  return {
    ...state.CreateTeamReducer,
    ...state.LiveReducer,
    ...state.PlayerDetailReducer,
    translations,
    curLang,
    cachedPlayerData,
    cachedTeamData,
    loading,
    cookie,
    HasFourTeams,
    currMDID,
    createTeamBuster,
    serverDate,
    multiToastMsg,
    toastMsgteam
    // subsAllowed,
    // subsPending,
    // oldSubsLeft,
    // plyrCanotSelected
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTeam);
