import React, { useEffect, useRef } from "react"
import {Bodies, Composites, Engine, Mouse, MouseConstraint, Render, World} from "matter-js"

const blockWidth = 80
const blockHeight = 80
const stackColumns = 6
const stackRows = 4
const stackWidth = stackColumns * blockWidth
const stackHeight = stackRows * blockHeight

const wallThickness = 100
// so high that when blocks are flung really high, they still can't escape over side wall
const wallHeight = 10_000
const floorThickness = 50

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
        const floorVerticalCenter = boxHeight - 40
        const stackTop = floorVerticalCenter - stackHeight - 100

        const engine = Engine.create(),
            world = engine.world
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

        // add bodies
        const stack = Composites.stack(stackLeft, stackTop, stackColumns, stackRows, 0, 0, (x, y) => {
            return Bodies.rectangle(x, y, blockWidth, blockHeight);
        });

        World.add(world, stack);
        World.add(world, [
            Bodies.rectangle(boxCenter, floorVerticalCenter, boxWidth, floorThickness, { isStatic: true }),
            Bodies.rectangle(-wallThickness / 2, boxHeight / 2, wallThickness, wallHeight, { isStatic: true }),
            Bodies.rectangle(boxWidth + wallThickness / 2, boxHeight / 2, wallThickness, wallHeight, { isStatic: true })
        ]);


        // add mouse control
        const mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
        World.add(world, mouseConstraint);

        //// not sure what this does but commented out and no change
        // keep the mouse in sync with rendering
        // render.mouse = mouse;


        Engine.run(engine)
        Render.run(render)
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
