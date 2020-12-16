# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Stack blocks and see commentary

As you stack blocks, events will be sent to Segment.  At the same time your browser is listening to a Twilio chat channel. Segment will ingest the event, decide if it's worth commenting on, and if so, send a comment to the Twilio chat channel.

## Sample helpful curls

List messages in the general channel
`curl https://chat.twilio.com/v2/Services/IS2480e232ff704626b42d590ebf23e771/Channels/general/Messages -u "SKa5c34985affae1f12ceaa897f3836275:${TWILIO_API_SECRET}" | jq`

Post a test message in the general channel
`curl -XPOST https://chat.twilio.com/v2/Services/IS2480e232ff704626b42d590ebf23e771/Channels/general/Messages -u "SKa5c34985affae1f12ceaa897f3836275:${TWILIO_API_SECRET}" -d 'Body=test' | jq`

## The infrastructure:

Twilio function for token endpoint for local chat client:
`https://www.twilio.com/console/functions/editor/ZSd860117e02a40a6eccdaa5b7e0aa2ce4/environment/ZE69304f806e223510ecb513315ea395cc/config/variables`

Segment function for processing events and sending chat messages:
`https://app.segment.com/twilio-khart/functions/catalog/dfn_5fc9e0044832c150fcfd40c8/edit/code`

## Deploy it to github pages

`npm run deploy`


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
