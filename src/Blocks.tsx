import React, { useEffect, useRef } from "react"
import Matter from "matter-js"

export const Blocks = () => {
    const boxRef = useRef<HTMLDivElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (boxRef.current === null) {
            return
        }

        const boxWidth = boxRef.current.offsetWidth
        const boxHeight = boxRef.current.offsetHeight

        let Engine = Matter.Engine
        let Render = Matter.Render
        let World = Matter.World
        let Bodies = Matter.Bodies
        let engine = Engine.create({})
        let render = Render.create({
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
        const floor = Bodies.rectangle(boxWidth / 2, boxHeight - 10, boxWidth, 20, {
        isStatic: true,
        render: {
            fillStyle: "blue",
        },
        })
        const ball = Bodies.circle(boxWidth / 2, 0, 10, {
        restitution: 0.9,
        render: {
            fillStyle: "yellow",
        },
        })
        World.add(engine.world, [floor, ball])
        Engine.run(engine)
        Render.run(render)
    }, [boxRef.current])
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
