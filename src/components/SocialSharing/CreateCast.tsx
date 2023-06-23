import React, { useEffect, useState } from 'react';
import { getHubRpcClient, Message } from '@farcaster/hub-web';

export async function FetchCasts(isConnected: boolean, base64SignedMessage: string) {
    const client = await getHubRpcClient("<your-hub-url>");
    if (isConnected === false) {
        const message = Message.decode(Buffer.from(base64SignedMessage, 'base64'));
        const messageObject = { data: message }; // Create an object with the expected shape
        //client.submitMessage(messageObject);
    }
}


