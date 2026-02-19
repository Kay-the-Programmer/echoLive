

import { collection, writeBatch, doc, Firestore } from 'firebase/firestore';
import { allStreams, users, violations } from './data';
import type { PartyRoom } from './types';

export async function seedDatabase(db: Firestore) {
  const batch = writeBatch(db);
  
  // Seed Streams
  const streamsCollection = collection(db, 'streams');
  allStreams.forEach((stream) => {
    const docRef = doc(streamsCollection, stream.id);
    batch.set(docRef, stream);
  });
  
  // Seed Users
  const usersCollection = collection(db, 'users');
  users.forEach((user) => {
    const docRef = doc(usersCollection, user.id);
    const cleanUser = { ...user };
    // Ensure seeded users don't have special roles by default unless specified in data.ts
    if (user.id !== 'u1') {
      delete cleanUser.isAdmin;
      delete cleanUser.isOwner;
    }
    batch.set(docRef, cleanUser);
  });

  // Seed Party Rooms for all streams marked as such
  const partyRoomsCollection = collection(db, 'party_rooms');
  const partyRoomsFromStreams = allStreams.filter(s => s.isPartyRoom);

  partyRoomsFromStreams.forEach(stream => {
    const capacity = 4; // All mock party rooms will be 4-seaters for now
    const seats: { [key: string]: string | null } = {};
    for (let i = 1; i <= capacity; i++) {
      seats[String(i)] = null;
    }

    // Start with the host and add a few other random users to the room's user list
    const userIds = [stream.user.id];
    for (let i = 0; i < 3; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!userIds.includes(randomUser.id)) {
            userIds.push(randomUser.id);
        }
    }
    
    const partyRoomData: Omit<PartyRoom, 'id'> = {
      title: stream.title,
      roomType: `${capacity}-seat`,
      capacity: capacity,
      isLive: stream.isLive ?? true,
      userIds: userIds,
      seats: seats,
    };
    const partyRoomDocRef = doc(partyRoomsCollection, stream.id);
    batch.set(partyRoomDocRef, partyRoomData);
  });

  // Seed violations
  const violationsCollection = collection(db, 'violations');
  violations.forEach((violation) => {
    const docRef = doc(violationsCollection, violation.id);
    batch.set(docRef, violation);
  });

  // Seed the global balance document
  const globalBalanceRef = doc(db, 'global_balances', 'singleton');
  batch.set(globalBalanceRef, { totalUsdRevenue: 0 }, { merge: true });


  try {
    await batch.commit();
    console.log('Database seeded successfully with streams, users, party rooms, violations, and global balance!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
