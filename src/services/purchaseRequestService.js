import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

const UNAVAILABLE_STATUSES = ['inactive', 'sold', 'unavailable', 'reserved', 'deleted'];

export const createPurchaseRequest = async (buyerId, listing) => {
  if (!buyerId) {
    throw new Error('Tens de iniciar sessão para fazer um pedido de compra.');
  }

  if (!listing?.id || !listing?.sellerId) {
    throw new Error('Anúncio inválido.');
  }

  if (listing.sellerId === buyerId) {
    throw new Error('Não podes fazer um pedido de compra do teu próprio anúncio.');
  }

  const status = String(listing?.status ?? 'active').toLowerCase();
  if (
    UNAVAILABLE_STATUSES.includes(status) ||
    listing?.available === false ||
    listing?.isAvailable === false
  ) {
    throw new Error('Este anúncio não está disponível para compra.');
  }

  const docRef = doc(collection(db, 'purchaseRequests'));

  await setDoc(docRef, {
    buyerId,
    sellerId: listing.sellerId,
    listingId: listing.id,
    listingTitle: listing.title ?? '',
    listingPrice: listing.price ?? null,
    status: 'pending',
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};
