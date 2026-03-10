export type Sensor = {
  name: string;
  value: number;
  unit: string;
};

export type SensorsState = {
  humidity_room: Sensor;
  power_total: Sensor;
  temp_fridge: Sensor;
  temp_balcony: Sensor;
  temp_room: Sensor;
};

export type Door = {
  name: string;
  state: "open" | "closed";
};

export type Alarm = {
  armed: boolean;
  triggered: boolean;
};

export type SecurityState = {
  door_main: Door;
  alarm: Alarm;
};

export type Alert = {
  id: string;
  type: "TEMP_FRIDGE_HIGH";
  message: string;
  severity: "warning";
  createdAt: number;
};

export type HomeId = "123" | "456";

export type HomeState = {
  homeId: HomeId;
  updatedAt: number;
  sensors: SensorsState;
  security: SecurityState;
  alerts: Alert[];
};

export type HomeUpdatePayload = HomeState;

export type AlertNewPayload = {
  homeId: HomeId;
  alert: Alert;
};

export type TemperatureSensorId = "temp_fridge" | "temp_balcony" | "temp_room";

export type SubscribeHomePayload = HomeId;

export type UnsubscribeHomePayload = HomeId;
