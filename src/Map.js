import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import RBSheet from "react-native-raw-bottom-sheet";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

const markerData = [
  {
    id: 1,
    text: "A",
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4324
    }
  },
  {
    id: 2,
    text: "B",
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4334
    }
  },
  {
    id: 3,
    text: "C",
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4345
    }
  },
  {
    id: 4,
    text: "D",
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4364
    }
  },
  {
    id: 5,
    text: "E",
    coordinate: {
      latitude: 37.78825,
      longitude: -122.4374
    }
  }
];

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _x: null
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          mapType=""
          provider={PROVIDER_GOOGLE}
          style={styles.mapStyle}
          region={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          {markerData.map((marker, index) => (
            <Marker key={index} coordinate={marker.coordinate} onPress={() => {
              this.setState({ _x: marker.text });
              this.RBSheet.open();
            }} >
              <View style={{ backgroundColor: "red", padding: 2, borderRadius: 50 }}>
                <Text>{marker.text}</Text>
              </View>
              <RBSheet
                ref={ref => {
                  this.RBSheet = ref;
                }}
                closeOnDragDown={true}
                animationType="slide"
                height={150}
                duration={300}
                customStyles={{
                  container: {
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 20
                  },
                  draggableIcon: {
                    display: "none"
                  }
                }}
              >
                <Text>{`You clicked marker ${this.state._x}`}</Text>
              </RBSheet>
            </Marker>))}


        </MapView>
      </View >
    );
  }
}