import {Data} from './Tracker'

export type BrainEvent = {
    type: 'Yanking' | 'Stacked' | 'Falling' | 'JustDropped'
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
        const mostRecentData = state[state.length - 1]
        const previousData = state[state.length - 2]
        const change = this.calcChange(mostRecentData, previousData)

        // console.log(`Change in postion ${change.x}, ${change.y}. Speed ${change.speed}`)

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
        const mostRecentData = state[state.length - 1]
        const previousData = state[state.length - 2]
        const firstData = state[0]
        const secondData = state[1]
        const change = this.calcChange(mostRecentData, previousData)
        const avgSpeed = this.calcChange(mostRecentData, firstData).speed / state.length
        const totalMovementY = firstData.yPos - mostRecentData.yPos
        const firstMovementY = firstData.yPos - secondData.yPos

        console.log('Analyzing dropped state', state)
        console.log(avgSpeed)
        console.log(totalMovementY)
        console.log(!(state.length % 3))

        if (firstMovementY < -80) {
            console.log('User has simply dropped something.')
            return {
                type: 'JustDropped',
                parameters: {
                    // speed: change.speed,
                }
            }
        }

        // hasn't moved much on average and total movement hasn't gone down over 4 units
        if (!(state.length % 3) && avgSpeed < 10 && totalMovementY > -4) {
            console.log('User has stacked something.')
            return {
                type: 'Stacked',
                parameters: {
                    // speed: change.speed,
                }
            }
        }

        if (totalMovementY < -20) {
            console.log('User has made something fall.')
            return {
                type: 'Falling',
                parameters: {
                    // speed: change.speed,
                }
            }
        }

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
