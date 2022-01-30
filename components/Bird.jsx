import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useAnimatedReaction,
    useAnimatedProps,
    useSharedValue,
    runOnJS,
} from "react-native-reanimated";

const Bird = ({ width, height, left, bottom, rotation }) => {
    const birdImg = {
        fall: require("../assets/images/flappy-bird-fall.png"),
        rise: require("../assets/images/flappy-bird-rise.png"),
    };

    const [imgSrc, setimgSrc] = useState(birdImg.fall);

    useAnimatedReaction(
        () => {
            return bottom.value;
        },
        (current, previous) => {
            if (previous < current) {
                runOnJS(setimgSrc)(birdImg.rise);
                if (rotation.value > -90) {
                    rotation.value -= 20;
                }
            } else {
                runOnJS(setimgSrc)(birdImg.fall);
                if (rotation.value < 5) {
                    rotation.value += 4;
                }
            }
        },
        [bottom]
    );

    const AnimatedStyles = {
        bird: useAnimatedStyle(() => {
            return {
                bottom: bottom.value,
                transform: [{ rotateZ: `${rotation.value} deg` }],
            };
        }),
    };

    return (
        <Animated.Image
            source={imgSrc}
            style={[
                styles.bird,
                { width: width, height: height, left: left },
                AnimatedStyles.bird,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    bird: {
        position: "absolute",
        // backgroundColor: "yellow",
    },
});

export default Bird;
