import React from 'react';
import ReactDOM from 'react-dom';
import Client from 'twilio-chat';
import { Channel } from 'twilio-chat/lib/channel';

import './index.css';
import { user } from './user';
import App from './App';
import reportWebVitals from './reportWebVitals';

const serverHost = 'https://kdavh-github-io-prod-9942.twil.io';
const chatChannelPrefix = 'general-';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

let chatClient: Client;
let chatChannel: Channel;

// Set up channel after it has been found
async function setupChannel(chatChannel: Channel): Promise<any> {
  try {
    await chatChannel.getMemberByIdentity(user);
  } catch (e) {
    // Join the general channel
    await chatChannel.join();
    console.log('Joined channel as '
    + '<span class="me">' + user + '</span>.', true);
  }

  let removeMessageTimeout: any;
  // Listen for new messages sent to the channel
  chatChannel.on('messageAdded', function(message) {
    const commentElement = document.querySelector('#comment-space')
    if (commentElement) {
      commentElement.innerHTML = `<div class='comment-space-text'>${message.body}</div>`;
      clearTimeout(removeMessageTimeout);
      removeMessageTimeout = setTimeout(() => commentElement.innerHTML = '', 3000);
    }
  });
}

function createOrJoinChatChannel(chatClient: Client): Promise<any> {
  let chatChannelName: string = '';
  const idPromise = new Promise((resolve) => {
    window.analytics.ready(() => {
      chatChannelName = chatChannelPrefix + window.analytics.user().anonymousId();
      console.log(`chat channel name determined: ${chatChannelName}`)
      resolve();
    });
  });
  // Get the general chat channel, which is where all the messages are
  // sent in this simple application
  // print('Attempting to join "general" chat channel...');
  return idPromise
  .then(() => chatClient.getChannelByUniqueName(chatChannelName))
  .then(function(channel) {
    chatChannel = channel;
    console.log('Found general channel:');
    console.log(chatChannel);
    setupChannel(chatChannel);
  }).catch(function() {
    // If it doesn't exist, let's create it
    console.log('Creating general channel');
    chatClient.createChannel({
      uniqueName: chatChannelName,
      friendlyName: 'The Chat Channel',
    }).then(function(channel) {
      console.log('Created general channel:');
      console.log(channel);
      chatChannel = channel;
      return setupChannel(chatChannel);
    }).catch(function(channel) {
      console.log('Channel could not be created:');
      console.log(channel);
    });
  });
}

function refreshToken(identity: string) {
  console.log('Token about to expire');
  // Make a secure request to your backend to retrieve a refreshed access token.
  // Use an authentication mechanism to prevent token exposure to 3rd parties.
  fetch(`${serverHost}/token?blockchatUser=${user}`)
  .then((r) => r.json())
  .then((data) => {
    chatClient.updateToken(data.token);
  });
}

fetch(`${serverHost}/token?blockchatUser=${user}`)
  .then((r) => r.json())
  .then((data) => {
    console.log('Received token response:');
    console.log(data);
    // Initialize the Chat client
    Client.create(data.token).then(client => {
      console.log('Created chat client');
      chatClient = client;
      chatClient.getSubscribedChannels()
        .then(() => createOrJoinChatChannel(chatClient));

      // when the access token is about to expire, refresh it
      chatClient.on('tokenAboutToExpire', function() {
        refreshToken(user);
      });

      // if the access token already expired, refresh it
      chatClient.on('tokenExpired', function() {
        refreshToken(user);
      });

    console.log('You have been assigned a random username of: '
    + '<span class="me">' + user + '</span>', true);

    }).catch(error => {
      console.error(error);
      console.log('There was an error creating the chat client:<br/>' + error, true);
      console.log('Please check your .env file.', false);
    });
  });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
