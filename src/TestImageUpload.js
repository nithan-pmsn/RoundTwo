import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView
} from "react-native";
import {
  Image,
  Platform,
  PermissionsAndroid,
  Dimensions
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import RBSheet from "react-native-raw-bottom-sheet";

const window = Dimensions.get("window");

export default class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edges: [],
      largePicIndex: 0,
      loadNoOfImg: 50,
      userId: "",
      hasCameraPermission: false,
      location: "",
      endCursor: "",
      hasNextPage: true
    };
  }


  componentWillMount = () => {
    if (Platform.OS === "android") {
      this.askPermissionToAndroid();
    } else {
      this.getPhotos();
    }
  };

  componentDidMount = () => {
    this.setState({ hasCameraPermission: true });
  };

  askPermissionToAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Camera Permission",
          message: "App needs access to your camera."
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ hasCameraPermission: true });
        this.getPhotos();
      } else {
        this.setState({ hasCameraPermission: false });
      }
    } catch (err) {
      console.warn("Error ", err);
    }
  };

  getPhotos = () => {
    let fetchParams = {
      first: 15
    };

    if (this.state.endCursor) {
      fetchParams.after = this.state.endCursor;
    }

    CameraRoll.getPhotos(fetchParams)
      .then(e => {
        if (this.state.hasNextPage) {
          let oldImagesArr = this.state.edges;
          oldImagesArr.push(...e.edges);
          this.setState({
            edges: oldImagesArr,
            endCursor: e.page_info.end_cursor,
            hasNextPage: e.page_info.has_next_page
          });
        }
      })
      .catch(err => {
        console.log("Fetch error ", err);
      });
  };

  galleryHeaderComponent = () => {
    return (
      <View>
        {this.state.edges.length > 0 ? (
          <Image
            style={{ height: 400, width: "100%", borderRadius: 3, paddingBottom: 5 }}
            source={{
              uri:
                this.state.edges.length > 0
                  ? this.state.edges[this.state.largePicIndex].node.image.uri
                  : null
            }}
          />

        ) : null}
      </View>
    );
  };

  async uploadPicture(edges, index) {
    await fetch("https://815xg4up3i.execute-api.ap-south-1.amazonaws.com/dev/demo-RoundTwo", {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        // key: this.state.edges[this.state.largePicIndex].node.image.fileName
      })
    })
      .then(res => res.json())
      .then(response => {
        console.log(response)
        fetch(response.Url, {
          method: 'PUT',
          mode: 'cors',
          body: this.state.edges[this.state.largePicIndex].node.image
        })
          .then((res) => {
            // console.log(res)
            alert("Picture uploaded successfully...")
          })
          .catch((err) => console.log(err))
      }).catch(err => console.log(err))
  }

  renderGalleryImages = ({ item, index }) => {
    // console.log(item)
    return (<View
      key={String(Math.random() + index)}
      style={{ margin: StyleSheet.hairlineWidth, alignSelf: "center" }}
    >
      <TouchableOpacity
        onPress={() => {
          this.refs.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
          this.setState({
            largePicIndex: index
          });
          this.RBSheet.open();
        }}
      >
        <Image
          source={{ uri: item.node.image.uri }}
          style={{ width: window.width / 3, height: window.width / 4 }}
          borderRadius={5}
          resizeMethod={"resize"}
          resizeMode={"cover"}
        />
      </TouchableOpacity>
    </View>
    );
  };
  render() {
    if (this.state.edges.length < 0) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }

    return (
      <SafeAreaView
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* Header Start */}

        {/* Header End */}
        {/* Gallery images Flatlist start */}
        {this.state.hasCameraPermission ? (

          <View style={{ height: "100%", width: "100%" }}>

            <View><FlatList
              contentContainerStyle={{
                width: "100%"
              }}
              columnWrapperStyle={{
                justifyContent: "center",
                alignItems: "center"
              }}
              numColumns={3}
              ref="listRef"
              ListHeaderComponent={this.galleryHeaderComponent}
              // ListFooterComponent={<View style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 10, borderTopColor: "#eee", borderTopWidth: 1 }}><Text>That's all.End.</Text></View>}
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 10
                  }}
                >
                  <Text>Gallery is Empty.</Text>
                </View>
              }
              data={this.state.edges}
              extraData={this.state}
              renderItem={this.renderGalleryImages}
              keyExtractor={(item, index) => item.node.image.uri + index}
              onEndReached={this.getPhotos}
              onEndReachedThreshold={0.5}
            />
              <RBSheet
                ref={ref => {
                  this.RBSheet = ref;
                }}
                closeOnDragDown={true}
                animationType="slide"
                height={100}
                duration={300}
                customStyles={{
                  container: {
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 30
                  },
                  draggableIcon: {
                    display: "none"
                  }
                }}
              >
                {this.state.edges.length > 0 ? (
                  <TouchableOpacity
                    style={{ position: "absolute", justifyContent: "center" }}
                    onPress={() => this.uploadPicture(this.state.edges, this.state.largePicIndex)}
                  >
                    <Text style={{ color: "#487EB0" }}>Upload</Text>
                  </TouchableOpacity>
                ) : null}</RBSheet>
            </View>

          </View>
        ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                width: "100%"
              }}
            >
              <TouchableOpacity
                onPress={this.askPermissionToAndroid}
                style={{ marginTop: 6 }}
              >
                <Text>Click here to allow the app to access the gallery</Text>
              </TouchableOpacity>
            </View>
          )}
        {/* Gallery images Flatlist end */}
      </SafeAreaView>
    );
  }
}
