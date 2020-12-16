import {Body, Composite} from 'matter-js'

import Brain from './Brain'

type IntervalId = number | undefined

declare global {
    interface Window { analytics: any; }
}

const measureDelay = 500
const maxMeasurements = 15

export type Data = {
    xPos: number
    yPos: number
}

export default class Tracker {
    private static draggingState: Data[] = []
    private static droppedState: Data[] = []
    private static trackDragging: IntervalId;
    private static trackDropped: IntervalId;

    public static dragStarted(composite: Composite, body: Body): void {
        this.draggingState = [this.bodyToData(body)]
        window.clearInterval(this.trackDragging)
        this.trackDragging = window.setInterval(() => {
            const nextBody = Composite.get(composite, body.id, 'body') as Body
            this.draggingState.push(this.bodyToData(nextBody))
            const event = Brain.findDraggingSignificance(this.draggingState)
            if (event) {
                window.analytics.track(event.type, event.parameters)
                console.log('Tracked:')
                console.table(event)
            }
            if (this.draggingState.length > maxMeasurements) {
                window.clearInterval(this.trackDragging)
            }
        }, measureDelay)
    }

    public static dragEnded(composite: Composite, body: Body): void {
        this.draggingState = []
        window.clearInterval(this.trackDragging)
        this.droppedState = [this.bodyToData(body)]
        window.clearInterval(this.trackDropped)
        this.trackDropped = window.setInterval(() => {
            const nextBody = Composite.get(composite, body.id, 'body') as Body
            this.droppedState.push(this.bodyToData(nextBody))
            const event = Brain.findDroppedSignificance(this.droppedState)
            if (event) {
                window.analytics.track(event.type, event.parameters)
            }
            if (this.droppedState.length > maxMeasurements) {
                window.clearInterval(this.trackDropped)
            }
        }, 1000)
    }

    private static bodyToData(body: Body): Data {
        return {
            xPos: body.position.x,
            yPos: body.position.y,
        }
    }
}
