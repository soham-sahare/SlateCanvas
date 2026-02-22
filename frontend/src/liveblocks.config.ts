import { createClient } from "@liveblocks/client";
import { createRoomContext, createLiveblocksContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || "pk_prod_placeholder",
});

// Presence represents the properties that will be shared with other users in the room.
// In our case, we want to share the cursor position and possibly the selection.
type Presence = {
  cursor: { x: number; y: number } | null;
  selection: string[];
  name?: string;
  color?: string;
};

// Storage represents the shared state that is persisted in the room.
// We'll use Yjs for the main whiteboard elements, so we might not need much in Storage.
type Storage = {
  // elements: LiveList<WhiteboardElement>; // We'll use Yjs instead
};

// UserMeta represents the metadata associated with a user.
type UserMeta = {
  id: string;
  info: {
    name: string;
    avatar: string;
    color: string;
  };
};

// RoomEvent represents the events that can be broadcasted in the room.
type RoomEvent = {
  // type: "CHAT";
  // message: string;
};

// ThreadMetadata represents the metadata associated with a thread.
export type ThreadMetadata = {
  // resolved: boolean;
  // quote: string;
  // x: number;
  // y: number;
};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useOthers,
    useOthersMapped,
    useOthersListener,
    useOthersConnectionIds,
    useOther,
    useSelf,
    useStorage,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useUser,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(client);
