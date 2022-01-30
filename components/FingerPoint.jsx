import React, { useEffect } from "react"
import { View } from "react-native"
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withTiming,
} from "react-native-reanimated"
import FingerPointer from "../assets/images/finger_point_up.png"

function FingerPoint({ width, height, top, left }) {
	const animatedTop = useSharedValue(top || 0)

	const animatedStyles = useAnimatedStyle(() => {
		return {
			position: "absolute",
			width: width || 30,
			height: height || 30,
			resizeMode: "contain",
			top: animatedTop.value,
			left: left || 0,
		}
	})

	useEffect(() => {
		animatedTop.value = withRepeat(
			withTiming(animatedTop.value + 20),
			-1,
			true
		)
	}, [])

	return (
		<View>
			<Animated.Image
				style={animatedStyles}
				source={FingerPointer}
				alt=""
			/>
		</View>
	)
}

export default FingerPoint
