import { StatusBar } from "expo-status-bar"
import React, { useState, useEffect } from "react"
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	Pressable,
	SafeAreaView,
	Image,
	ImageBackground,
} from "react-native"
import Animated, {
	useSharedValue,
	withRepeat,
	withSpring,
	withTiming,
	withDelay,
	Easing,
} from "react-native-reanimated"
import "react-native-gesture-handler"

import useAsyncStorage from "./hook/useAsyncStorage"
import Bird from "./components/Bird"
import Obstacle from "./components/Obstacle"

const { width } = Dimensions.get("screen")
const { height } = Dimensions.get("screen")
const BIRD_WIDTH = 50
const BIRD_HEIGHT = 35
const BIRD_LEFT = width / 2 - BIRD_WIDTH / 2
const BIRD_BOTTOM = height / 2 - BIRD_HEIGHT / 2
const obstacle_width = 65

const gravity = 5
const initialObstacleSpeed = 12
const interval = 35

let gameTimerId
let obstacleTimerId
let obstacle2_TimerId
let minGapHeight = BIRD_HEIGHT * 6

function randomNegative(number) {
	return number * (Math.random() < 0.5 ? -1 : 1)
}

export default function App() {
	const [gameOver, setGameOver] = useState(true)
	const [score, setScore] = useState(0)
	const [firstGame, setFirstGame] = useState(true)
	const [obstacleSpeed, setObstacleSpeed] = useState(initialObstacleSpeed)
	const [highestScore, setHighestScore] = useAsyncStorage("highestScore", 0)

	const bird_bottom = useSharedValue(BIRD_BOTTOM)
	const bird_rotation = useSharedValue(0)
	let offset = randomNegative(Math.random() * 50)
	const oHeight = useSharedValue(height / 2)
	const oHeight_neg = useSharedValue(offset)
	let offset_2 = randomNegative(Math.random() * 25)
	const oHeight_2 = useSharedValue(height / 2)
	const oHeight_neg_2 = useSharedValue(offset)
	const obstacle_left = useSharedValue(width)
	const obstacle2_left = useSharedValue(
		width + width / 2 + obstacle_width / 2
	)

	const updateHighestScore = () => {
		if (score > highestScore) {
			setHighestScore(score)
		}
	}

	function MoveBird() {
		if (bird_bottom.value >= 0) {
			gameTimerId = setInterval(() => {
				bird_bottom.value = withTiming(bird_bottom.value - gravity, {
					duration: interval,
				})

				let hitPipeOne =
					obstacle_left.value <= BIRD_LEFT + BIRD_WIDTH &&
					obstacle_left.value + obstacle_width >= BIRD_LEFT - 1 &&
					(bird_bottom.value <
						oHeight.value - minGapHeight + oHeight_neg.value ||
						bird_bottom.value + BIRD_HEIGHT + 34 >
							height - 44 - oHeight.value + oHeight_neg.value)

				let hitPipeTwo =
					obstacle2_left.value <= BIRD_LEFT + BIRD_WIDTH &&
					obstacle2_left.value + obstacle_width >= BIRD_LEFT - 1 &&
					(bird_bottom.value <
						oHeight_2.value - minGapHeight + oHeight_neg_2.value ||
						bird_bottom.value + BIRD_HEIGHT + 34 >
							height - 44 - oHeight_2.value + oHeight_neg_2.value)

				if (hitPipeOne || hitPipeTwo) {
					// console.log("game over")
					setGameOver(true)
					clearInterval(gameTimerId)
					clearInterval(obstacleTimerId)
					clearInterval(obstacle2_TimerId)
					bird_bottom.value = withDelay(
						200,
						withTiming(0, {
							duration: 500,
							easing: Easing.bezier(0.35, 0.07, 0.83, 0.33),
						})
					)
					bird_rotation.value = withDelay(
						200,
						withTiming(90, {
							duration: 500,
							easing: Easing.bezier(0.35, 0.07, 0.83, 0.33),
						})
					)
					updateHighestScore()
				}

				// console.log(bird_bottom.value);
				if (bird_bottom.value <= 0) {
					clearInterval(gameTimerId)
				}
			}, interval)
		}
	}

	// obstacle 1

	function moveObstacle() {
		if (obstacle_left.value + obstacle_width > 0) {
			obstacleTimerId = setInterval(() => {
				obstacle_left.value = withTiming(
					obstacle_left.value - obstacleSpeed,
					{
						duration: interval,
					}
				)
				// console.log(obstacle_left.value);

				if (
					obstacle_left.value + obstacle_width < BIRD_LEFT &&
					obstacle_left.value + obstacle_width + obstacleSpeed >=
						BIRD_LEFT
				) {
					setScore((score) => (score += 1))
				}

				if (obstacle_left.value <= 0 - obstacle_width) {
					offset = randomNegative(Math.random() * 25)
					oHeight_neg.value = offset
					obstacle_left.value = width
				}
			}, interval)
		}

		if (obstacle2_left.value + obstacle_width > 0) {
			obstacle2_TimerId = setInterval(() => {
				obstacle2_left.value = withTiming(
					obstacle2_left.value - obstacleSpeed,
					{ duration: interval }
				)
				// console.log(obstacle_left.value);

				if (
					obstacle2_left.value + obstacle_width < BIRD_LEFT &&
					obstacle2_left.value + obstacle_width + obstacleSpeed >=
						BIRD_LEFT
				) {
					setScore((score) => (score += 1))
				}

				if (obstacle2_left.value <= 0 - obstacle_width) {
					offset_2 = randomNegative(Math.random() * 25)
					oHeight_neg_2.value = offset_2
					obstacle2_left.value = width
				}
			}, interval)
		}
	}

	// flap Handler
	function flapHandler(e) {
		e.preventDefault()
		if (!gameOver) {
			bird_bottom.value = bird_bottom.value + BIRD_HEIGHT * 1.2
		}
	}

	function startGame() {
		setFirstGame(false)
		setGameOver(false)
		setScore(0)
		setObstacleSpeed(initialObstacleSpeed)
		bird_bottom.value = BIRD_BOTTOM
		bird_rotation.value = 0
		obstacle_left.value = width
		obstacle2_left.value = width + width / 2 + obstacle_width / 2
		offset = randomNegative(Math.random() * 25)
		oHeight_neg.value = offset
		offset_2 = randomNegative(Math.random() * 25)
		oHeight_neg_2.value = offset_2
		setTimeout(() => {
			moveObstacle()
			MoveBird()
		}, 100)
	}

	return (
		<>
			<ImageBackground
				source={require("./assets/images/flap_bg.png")}
				style={{
					flex: 1,
				}}
				resizeMode="cover">
				<SafeAreaView style={styles.container}>
					<View
						style={{
							position: "absolute",
							top: 50,
							left: 20,
							width: 130,
							zIndex: 5,
						}}>
						<Text>{`Highest Score: ${highestScore}`}</Text>
					</View>
					{gameOver && (
						<View
							style={{
								flex: 1,
								position: "absolute",
								justifyContent: "center",
								alignItems: "center",
								top: 0,
								bottom: 0,
								left: 0,
								right: 0,
								zIndex: 10,
								transform: [{ translateY: 40 }],
							}}>
							<Pressable
								style={{
									height: 40,
									width: 80,
									backgroundColor: "#FF3100",
									justifyContent: "center",
									alignItems: "center",
									borderRadius: 10,
									borderColor: "#FFF",
									borderWidth: 5,
								}}
								onPress={startGame}>
								<Text
									style={{
										fontSize: 18,
										fontWeight: "bold",
										color: "#fff",
									}}>
									Tap
								</Text>
							</Pressable>
						</View>
					)}
					<Pressable
						style={{
							flex: 1,
							position: "relative",
						}}
						onPress={flapHandler}>
						<StatusBar style="auto" />
						<View
							style={{
								position: "absolute",
								left: width / 2 - (gameOver ? 85 : 15),
								top: height / 4 - (gameOver ? 25 : 0),
								zIndex: 5,
								justifyContent: "center",
								alignItems: "center",
								flex: 1,
							}}>
							<Text
								style={{
									fontSize: gameOver ? 30 : 60,
									textAlign: "center",
									fontWeight: "bold",
									color: "#5CC566",
									textShadowColor: "#fff",
									textShadowOffset: { width: 3, height: 4 },
									textShadowRadius: 4,
								}}>
								{firstGame
									? "GET READY!"
									: gameOver
									? `Game Over \n Score: ${score}`
									: `${score}`}
							</Text>
						</View>
						<Bird
							width={BIRD_WIDTH}
							height={BIRD_HEIGHT}
							left={BIRD_LEFT}
							bottom={bird_bottom}
							rotation={bird_rotation}
						/>
						<Obstacle
							left={obstacle_left}
							height={oHeight}
							width={obstacle_width}
							height_neg={oHeight_neg}
							minGapHeight={minGapHeight}
						/>
						<Obstacle
							left={obstacle2_left}
							height={oHeight_2}
							width={obstacle_width}
							height_neg={oHeight_neg_2}
							minGapHeight={minGapHeight}
						/>
					</Pressable>
				</SafeAreaView>
			</ImageBackground>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// backgroundColor: "#fff",
	},
})
