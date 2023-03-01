import cardsFactory from "./factories/cardsFactory.js"
import handGestureFactory from "../src/factories/handGestureFactory.js"

await cardsFactory.initialize()
await handGestureFactory.initialize()