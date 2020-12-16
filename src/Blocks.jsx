import React, { useEffect, useRef } from "react"
import {Bodies, Common, Composites, Engine, Events, Mouse, MouseConstraint, Render, Runner, World} from "matter-js"

import Tracker from './Tracker.ts'

// fix issue with matter vertices requirement
import decomp from 'poly-decomp';
window.decomp = decomp;

const blockWidth = 80
// const blockHeight = 80
const stackColumns = 6
const stackRows = 4
const stackWidth = stackColumns * blockWidth
// const stackHeight = stackRows * blockHeight

const wallThickness = 100
// so high that when blocks are flung really high, they still can't escape over side wall
const wallHeight = 10_000

export const Blocks = () => {
    const boxRef = useRef(null)
    const canvasRef = useRef(null)
    useEffect(() => {
        // TODO allow window resize to resize canvas width / height
        if (boxRef.current === null) {
            return
        }

        const boxWidth = boxRef.current.offsetWidth
        const boxHeight = boxRef.current.offsetHeight
        const boxCenter = boxWidth / 2
        const stackLeft = boxCenter - stackWidth / 2

        const engine = Engine.create()
        const world = engine.world
        const render = Render.create({
            element: boxRef.current || undefined,
            engine: engine,
            canvas: canvasRef.current || undefined,
            options: {
                width: boxWidth,
                height: boxHeight,
                background: "rgba(255, 0, 0, 0.5)",
                wireframes: false,
            },
        })
        Render.run(render)
        // create runner
        var runner = Runner.create();
        Runner.run(runner, engine);


        // add walls
        World.add(world, [
            Bodies.rectangle(boxCenter, boxHeight, boxWidth, wallThickness, { isStatic: true }),
            Bodies.rectangle(-wallThickness / 2, boxHeight / 2, wallThickness, wallHeight, { isStatic: true }),
            Bodies.rectangle(boxWidth + wallThickness / 2, boxHeight / 2, wallThickness, wallHeight, { isStatic: true })
        ]);

        // // add bodies
        // const stack = Composites.stack(stackLeft, 50, stackColumns, stackRows, 0, 0, (x, y) => {
        //     return Bodies.rectangle(x, y, blockWidth, blockHeight);
        // });

        // World.add(world, stack);
        const square = [{x: 80, y: 0}, {x: 80, y: 80}, {x: 0, y: 80}, {x: 0, y: 0}]
        const arrow = [{x: 40, y: 0}, {x: 40, y: 20}, {x: 100, y: 20}, {x: 100, y: 80}, {x: 40, y: 80}, {x: 40, y: 100}, {x: 0, y: 50}]
        const chevron = [{x: 100, y: 0}, {x: 75, y: 50}, {x: 100, y: 100}, {x: 25, y: 100}, {x: 0, y: 50}, {x: 25, y: 0}]
        const star = [{x: 50, y: 0}, {x: 63, y: 38}, {x: 100, y: 38}, {x: 69, y: 59}, {x: 82, y: 100}, {x: 50, y: 75}, {x: 18, y: 100}, {x: 31, y: 59}, {x: 0, y: 38}, {x: 37, y: 38}]
        // const horseShoe = [{x: 35, y: 7}, {x: 19, y: 17}, {x: 14, y: 38}, {x: 14, y: 58}, {x: 25, y: 79}, {x: 45, y: 85}, {x: 65, y: 84}, {x: 65, y: 66}, {x: 46, y: 67}, {x: 34, y: 59}, {x: 30, y: 44}, {x: 33, y: 29}, {x: 45, y: 23}, {x: 66, y: 23}, {x: 66, y: 7}, {x: 53, y: 7}]

        // TODO: make this irregular stack centered
        const stack = Composites.stack(stackLeft, 50, stackColumns, stackRows, 0, 0, function(x, y) {
            var color = Common.choose(['#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58']);
            return Bodies.fromVertices(x, y, Common.choose([square, square, arrow, chevron, star]), {
                render: {
                    fillStyle: color,
                    strokeStyle: color,
                    lineWidth: 1
                }
            }, true);
        });

        World.add(world, stack);

        // add mouse control
        const mouse = Mouse.create(render.canvas)
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });
        World.add(world, mouseConstraint);

        // not sure what this does but commented out and no change
        // keep the mouse in sync with rendering
        render.mouse = mouse;

        // track the item to see if it's doing anything interesting
        Events.on(mouseConstraint, 'enddrag', function(event) {
            Tracker.dragEnded(stack, event.body)
        });

        Events.on(mouseConstraint, 'startdrag', function(event) {
            Tracker.dragStarted(stack, event.body)
        });

        Engine.run(engine)
    }, [])
    return (
        <div
            ref={boxRef}
            style={{
                width: "100%",
                height: "100%",
            }}
        >
        <canvas ref={canvasRef} />
        </div>
    )
}
