import {Data} from './Tracker'

export type BrainEvent = {
    type: 'Yanking'
    parameters?: {}
}

type Change = {
    x: number,
    y: number,
    speed: number,
}

export default class Brain {
    public static findDraggingSignificance(state: Array<Data>): BrainEvent | null {
        const secLapsed = state.length - 1
        if (secLapsed < 1) {
            return null
        }
        console.log('Analyzing dragging state', state)
        const lastData = state[state.length - 1]
        const previousData = state[state.length - 2]
        const change = this.calcChange(lastData, previousData)

        console.log(`Change in postion ${change.x}, ${change.y}. Speed ${change.speed}`)

        if (change.speed > 200) {
            console.log('User is yanking a shape around.')
            return {
                type: 'Yanking',
                parameters: {
                    speed: change.speed,
                }
            }
        }
        return null
    }

    public static findDroppedSignificance(state: Array<Data>): BrainEvent | null {
        const secLapsed = state.length - 1
        if (secLapsed < 1) {
            return null
        }
        // console.log('Analyzing dropped state', state)

        return null
    }

    private static calcChange(data1: Data, data2: Data): Change {
        const xChange = data1.xPos - data2.xPos
        const yChange = data1.yPos - data2.yPos

        return {
            x: xChange,
            y: yChange,
            speed: (xChange ** 2 + yChange ** 2) ** 0.5,
        }
    }
}
