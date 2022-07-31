import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, FlatList, Image, Text, StatusBar, Animated } from 'react-native';

const BG_IMG = 'https://i.pinimg.com/474x/70/e2/f9/70e2f9d4191154624f58c15eb684e27a.jpg';

const SPACE = 20;
const AVATA_SIZE = 70;
const ITEM_SIZE = AVATA_SIZE + SPACE * 3;

const css = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'white',
    backfaceVisibility: 'hidden'
  },

  contentFlatList: {
    paddingHorizontal: SPACE,
    marginTop: StatusBar.currentHeight || 42,
  },

  boxView: {

  },

  imgStyle: {
    height: AVATA_SIZE,
    width: AVATA_SIZE,
    borderRadius: AVATA_SIZE,
    marginRight: SPACE,
    marginLeft: - 25,
  },

  txtTitle: {
    fontSize: 18,
    fontWeight: '700'
  },

  txtDesc: {
    fontSize: 14,
    width: 250,
    marginTop: 10
  }

});

export default function App() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    const fetchData = async () => {
      const dataSearch = await fetch('https://api.sampleapis.com/coffee/hot');
      const resp = await dataSearch.json();
      setData(resp);
      setLoading(false);
    }

    fetchData();

  }, [])

  return (
    <View style={css.bg}>
      <Image
        source={{ uri: BG_IMG }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={50}
      />
      <Animated.FlatList
        data={data}
        onScroll={
          Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )
        }
        keyExtractor={item => item.id}
        contentContainerStyle={css.contentFlatList}
        renderItem={({ item, index }) => {

          const inputRange = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + 2)
          ];

          const inputRangeOpacity = [
            -1,
            0,
            ITEM_SIZE * index,
            ITEM_SIZE * (index + .5)
          ];

          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0]
          });

          const opacity = scrollY.interpolate({
            inputRange: inputRangeOpacity,
            outputRange: [1, 1, 1, 0]
          });

          return (
            <Animated.View style={{
              flexDirection: 'row',
              padding: SPACE,
              marginBottom: SPACE,
              backgroundColor: 'rgba(255,255,255,0.8)',
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: {
                height: 10,
                width: 0
              },
              shadowOpacity: .5,
              shadowRadius: 20,
              elevation: 20,
              transform: [{ scale }],
              opacity
            }} >
              <Image
                source={{ uri: item.image }}
                style={css.imgStyle}
              />
              <View>
                <Text style={css.txtTitle}>{item.title}</Text>
                <Text style={css.txtDesc} numberOfLines={3}> {item.description}</Text>
              </View>
            </Animated.View>
          )
        }}
      />
    </View>
  );
}