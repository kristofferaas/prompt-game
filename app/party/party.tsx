"use client";

import { env } from "@/lib/env";
import { serverSentMessagesSchema } from "@/lib/schema/server-sent-message-schema";
import { usePartySocket } from "partysocket/react";
import { useProompt } from "@/components/proompt/useProompt";
import { createContext, useCallback, useContext, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { ClientSentMessage } from "@/lib/schema/client-sent-message-schema";

export type PartyProps = {
  room: string;
  children: React.ReactNode;
};

const PartyContext = createContext<
  ((message: ClientSentMessage) => void) | null
>(null);

export function usePartySend() {
  const send = useContext(PartyContext);

  if (!send) {
    throw new Error("useParty must be used within a Party");
  }

  return send;
}

export function Party({ room, children }: PartyProps) {
  const { getToken } = useAuth();
  const socket = usePartySocket({
    host: env.NEXT_PUBLIC_PARTYKIT_HOST,
    room,
    onMessage: handleOnMessage,
    // attach the token to PartyKit in the query string
    query: async () => ({
      // get an auth token using your authentication client library
      token: await getToken(),
    }),
  });

  const handleSend = useCallback(
    (message: ClientSentMessage) => {
      socket.send(JSON.stringify(message));
    },
    [socket]
  );

  const { user } = useUser();
  let message: ClientSentMessage | null = null;
  if (user) {
    message = {
      type: "join",
      name: user.fullName ?? "Anonymous",
    };
  }

  useEffect(() => {
    if (message) {
      handleSend(message);
    }
  }, [handleSend, message]);

  return (
    <PartyContext.Provider value={handleSend}>{children}</PartyContext.Provider>
  );
}

const handleOnMessage = (event: MessageEvent) => {
  const data = serverSentMessagesSchema.parse(JSON.parse(event.data));

  switch (data.type) {
    case "round-started": {
      useProompt.getState().setRound(data.round);
      break;
    }
    case "message-received": {
      useProompt.getState().newMessage(data.message);
      break;
    }
    case "presence": {
      useProompt.getState().setPlayers(data.players);
      break;
    }
    default: {
      console.log("unhandled message", data);
    }
  }
};
