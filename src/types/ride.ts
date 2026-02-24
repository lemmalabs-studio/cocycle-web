export interface RouteCoordinate {
  latitude: number;
  longitude: number;
}

export interface RouteResponse {
  id: string;
  creatorId: string;
  creatorName?: string;
  name: string;
  description?: string;
  distance: number;
  elevationGain: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  geometry: string;
  coordinates?: RouteCoordinate[];
  staticMapUrl?: string;
  useCount: number;
  createdAt: string;
}

export interface RideResponse {
  id: string;
  creatorId: string;
  creatorName?: string;
  creatorAvatar?: string;
  title: string;
  description?: string;
  rideType: string;
  startTime: string;
  paceMin: number;
  paceMax: number;
  maxParticipants: number;
  currentParticipants: number;
  inviteOnly: boolean;
  womenOnly: boolean;
  routeId: string;
  route?: RouteResponse;
  distance: number;
  startLat: number;
  startLng: number;
  hasCafe: boolean;
  cafeLat?: number;
  cafeLng?: number;
  cafeName?: string;
  communityId?: string;
  status: string;
  isJoined?: boolean;
  isCreator?: boolean;
  createdAt: string;
}

export interface ParticipantResponse {
  userId: string;
  name?: string;
  avatar?: string;
  level?: string;
  joinedAt: string;
  isCreator: boolean;
}