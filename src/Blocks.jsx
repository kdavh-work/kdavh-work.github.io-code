import React, { useEffect, useRef } from "react"
import {Bodies, Composites, Engine, Mouse, MouseConstraint, Render, World} from "matter-js"

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

        const engine = Engine.create(),
            world = engine.world
        const render = Render.create({
            element: boxRef.current || undefined,
            engine: engine,
            canvas: canvasRef.current || undefined,
            options: {
                width: boxWidth,
                height: boxHeight,
                // background: "rgba(255, 0, 0, 0.5)",
                // wireframes: false,
            },
        })

        // add bodies
        const stack = Composites.stack(200, 380, 10, 5, 0, 0, function(x, y) {
            return Bodies.rectangle(x, y, 40, 40);
        });

        World.add(world, stack);
        World.add(world, [
            // walls
            Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
            Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
            Bodies.rectangle(400, 606, 800, 50.5, { isStatic: true })
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
