import React from "react"
import { StyleSheet, Text, View, Image } from "react-native"
import Animated, { useAnimatedStyle } from "react-native-reanimated"
import Pipe from "../assets/images/pipe.png"

const Obstacle = ({ left, height, width, height_neg, minGapHeight }) => {
	const AnimatedStyles = {
		obstacle_top: useAnimatedStyle(() => {
			return {
				left: left.value,
				height: height.value - height_neg.value,
				top: 0,
			}
		}),
		obstacle_bottom: useAnimatedStyle(() => {
			return {
				left: left.value,
				height: height.value,
				bottom: height_neg.value - minGapHeight,
			}
		}),
	}

	return (
		<>
			{/* <Animated.View
                style={[
                    styles.obstacle,
                    { top: 0 },
                    AnimatedStyles.obstacle_top,
                ]}
            > */}
			<Animated.Image
				source={Pipe}
				resizeMode="cover"
				style={[
					styles.obstacle,
					{
						width: width,

						transform: [{ rotateZ: "180deg" }],
					},
					AnimatedStyles.obstacle_top,
				]}
			/>
			{/* </Animated.View> */}
			<Animated.View style={[styles.obstacle, { bottom: 0 }]}>
				<Animated.Image
					source={Pipe}
					resizeMode="cover"
					style={[
						styles.obstacle,
						{ width: width },
						AnimatedStyles.obstacle_bottom,
					]}
				/>
			</Animated.View>
		</>
	)
}

const styles = StyleSheet.create({
	obstacle: {
		position: "absolute",
		// backgroundColor: "green",
		// borderColor: "black",
		// borderWidth: 1,
	},
})

export default Obstacle
