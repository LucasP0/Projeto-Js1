import { knowGestures, gestureStrings } from "../util/gestures.js"
export default class HandGestureService {
  #gestureEstimator
  #handPoseDetection
  #handsVersion
  #detector = null

  constructor({ fingerpose, handPoseDetection, handsVersion }) {
    this.#gestureEstimator = new fingerpose.GestureEstimator(knowGestures) 
    this.#handPoseDetection = handPoseDetection
    this.#handsVersion = handsVersion
  }

  async estimate(keypoints3D) {
    const predictions = await this.#gestureEstimator.estimate(
      this.#getLandMarksFromKeypoints(keypoints3D),
      // porcentagem de confiaça
      9
    )
    console.log({ predictions })
  }

  async * detectGestures(predictions) {
    for(const hand of predictions) {
      if (!hand.keypoints3D) continue
      const gestures = await this.estimate(hand.keypoints3D)
      console.log({ gesture })
    }
  }

  #getLandMarksFromKeypoints(keypoints3D) {
    return keypoints3D.map(keypoint => 
      [keypoint.x, keypoint.y, keypoint.z])
  }
  
  async estimateHands(video) {
    return this.#detector.estimateHands(video, {
      flipHorizontal: true
    })
  }

  async initializeDetector() {
    if (this.#detector) return this.#detector

    const detectorConfig = {
      runtime: 'mediapipe', // or 'tfjs',
      solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${this.#handsVersion}`,
      // full é o mais pesado e o mais preciso
      modelType: 'lite',
      maxHands: 2,
    }
    this.#detector = await this.#handPoseDetection.createDetector(
      this.#handPoseDetection.SupportedModels.MediaPipeHands, 
      detectorConfig
    )

    return this.#detector
  }
} 