import type { Firestore, DocumentReference, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { initAdmin } from './_seedUtils.js';

const TEST_DOMAIN = 'test.local';
const BATCH_LIMIT = 400;

async function deleteSubcollection(db: Firestore, parentRef: DocumentReference, sub: string) {
  const snap = await parentRef.collection(sub).get();
  if (snap.empty) return 0;

  let deleted = 0;
  let batch = db.batch();
  let count = 0;

  for (const doc of snap.docs) {
    batch.delete(doc.ref);
    count++;
    deleted++;
    if (count >= BATCH_LIMIT) {
      await batch.commit();
      batch = db.batch();
      count = 0;
    }
  }

  if (count > 0) await batch.commit();
  return deleted;
}

async function main() {
  const { db } = initAdmin();

  console.log(`Cleaning up all intakes marked testData or *@${TEST_DOMAIN}...`);

  let last: QueryDocumentSnapshot | null = null;
  let totalDeleted = 0;

  while (true) {
    let q = db.collection('intakes').orderBy('emailLower').limit(200);
    if (last) q = q.startAfter(last);

    const snap = await q.get();
    if (snap.empty) break;

    last = snap.docs[snap.docs.length - 1];

    const targets = snap.docs.filter((d) => {
      const emailLower = (d.get('emailLower') || d.get('email') || '').toString().toLowerCase();
      const isTestData = d.get('testData') === true;
      return isTestData || emailLower.endsWith(`@${TEST_DOMAIN}`);
    });

    for (const d of targets) {
      const ref = d.ref;

      const notesDeleted = await deleteSubcollection(db, ref, 'internalNotes');
      const auditDeleted = await deleteSubcollection(db, ref, 'audit');

      await ref.delete();
      totalDeleted++;

      console.log(`🗑️ Deleted intake ${ref.id} (notes:${notesDeleted}, audit:${auditDeleted})`);
    }
  }

  console.log(`\n✅ Cleanup complete. Deleted ${totalDeleted} mock intakes.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
