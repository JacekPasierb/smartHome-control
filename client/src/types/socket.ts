import type { AlertNewPayload, HomeUpdatePayload, SubscribeHomePayload, UnsubscribeHomePayload } from "./home";

export type ServerToClientEvents = {
  "home:update": (payload: HomeUpdatePayload) => void;
  "alert:new": (payload: AlertNewPayload) => void;
};

export type ClientToServerEvents = {
  "subscribe:home": (payload: SubscribeHomePayload) => void;
  "unsubscribe:home": (payload: UnsubscribeHomePayload) => void;
};
