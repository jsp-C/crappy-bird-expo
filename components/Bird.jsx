import React, { useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, {
	useAnimatedStyle,
	useAnimatedReaction,
	runOnJS,
} from "react-native-reanimated"
import FallingBird from "../assets/images/flappy-bird-fall.png"
import RisingBird from "../assets/images/flappy-bird-rise.png"

const Bird = ({ width, height, left, bottom, rotation }) => {
	const birdImg = {
		fall: FallingBird,
		rise: RisingBird,
	}

	const [imgSrc, setimgSrc] = useState(birdImg.fall)

	useAnimatedReaction(
		() => {
			return bottom.value
		},
		(current, previous) => {
			if (previous < current) {
				runOnJS(setimgSrc)(birdImg.rise)
				if (rotation.value > -90) {
					rotation.value -= 20
				}
			} else {
				runOnJS(setimgSrc)(birdImg.fall)
				if (rotation.value < 5) {
					rotation.value += 4
				}
			}
		},
		[bottom]
	)

	const AnimatedStyles = {
		bird: useAnimatedStyle(() => {
			return {
				bottom: bottom.value,
				transform: [{ rotateZ: `${rotation.value} deg` }],
			}
		}),
	}

	return (
		<Animated.Image
			source={imgSrc}
			style={[
				styles.bird,
				{ width: width, height: height, left: left },
				AnimatedStyles.bird,
			]}
		/>
	)
}

const styles = StyleSheet.create({
	bird: {
		position: "absolute",
		// backgroundColor: "yellow",
	},
})

export default Bird
