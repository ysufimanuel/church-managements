/**
 * Church Management System V6 - Firebase Integration
 * MULTI-TENANT: Setiap gereja punya data terisolasi penuh
 *
 * STRUKTUR FIRESTORE:
 *
 * churches/                          ← koleksi semua gereja
 *   {churchId}/
 *     nama, email, alamat, dll       ← profil gereja
 *     subscription: { status, plan, expiresAt }
 *
 * users/                             ← semua user (Firebase Auth UID sebagai doc ID)
 *   {uid}/
 *     churchId, role, nama, email    ← profil user + link ke gereja
 *
 * churches/{churchId}/members/       ← data jemaat gereja ini saja
 * churches/{churchId}/families/
 * churches/{churchId}/groups/
 * churches/{churchId}/events/
 * churches/{churchId}/attendance/
 * churches/{churchId}/donations/
 * churches/{churchId}/donors/
 * churches/{churchId}/volunteers/
 * churches/{churchId}/assignments/
 * churches/{churchId}/announcements/
 * churches/{churchId}/pemasukan/
 * churches/{churchId}/pengeluaran/
 * churches/{churchId}/financeCategories/
 * churches/{churchId}/financeConfig/
 * churches/{churchId}/approvalHistory/
 * churches/{churchId}/notifications/
 * churches/{churchId}/deaths/
 */

console.log('[FIREBASE] Script loading...');

// ========================================
// FIREBASE INITIALIZATION
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyBOyT_6Klad5P34gq-VbsY6gVqWYAnwiyE",
    authDomain: "churchmanagementsystem-a77a3.firebaseapp.com",
    projectId: "churchmanagementsystem-a77a3",
    storageBucket: "churchmanagementsystem-a77a3.firebasestorage.app",
    messagingSenderId: "369150207272",
    appId: "1:369150207272:web:0c9c3251c6c4300e0f5c1d",
    measurementId: "G-XWR9DH5Q0G"
};

try {
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js");
    const {
        getFirestore, collection, addDoc, getDocs, doc, setDoc,
        updateDoc, deleteDoc, getDoc, query, where, orderBy,
        onSnapshot, writeBatch
    } = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js");
    const {
        getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
        onAuthStateChanged, signOut, sendPasswordResetEmail
    } = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js");

    const app  = initializeApp(firebaseConfig);
    const db   = getFirestore(app);
    const auth = getAuth(app);

    window.firebaseApp = app;
    window.db   = db;
    window.auth = auth;
    window.firebaseCollection         = collection;
    window.firebaseAddDoc             = addDoc;
    window.firebaseGetDocs            = getDocs;
    window.firebaseDoc                = doc;
    window.firebaseSetDoc             = setDoc;
    window.firebaseUpdateDoc          = updateDoc;
    window.firebaseDeleteDoc          = deleteDoc;
    window.firebaseGetDoc             = getDoc;
    window.firebaseQuery              = query;
    window.firebaseWhere              = where;
    window.firebaseOrderBy            = orderBy;
    window.firebaseOnSnapshot         = onSnapshot;
    window.firebaseWriteBatch         = writeBatch;
    window.firebaseSignIn             = signInWithEmailAndPassword;
    window.firebaseCreateUser         = createUserWithEmailAndPassword;
    window.firebaseOnAuthStateChanged = onAuthStateChanged;
    window.firebaseSignOut            = signOut;
    window.firebaseSendPasswordResetEmail = sendPasswordResetEmail;

    console.log('[FIREBASE] Initialized — multi-tenant mode');
} catch (error) {
    console.error('[FIREBASE] Init error:', error);
    window.firebaseInitError = error.message;
}

// ========================================
// ACTIVE CHURCH STATE
// churchId diset setelah login, dipakai semua operasi data
// ========================================

let _activeChurchId = null;

function setActiveChurch(churchId) {
    _activeChurchId = churchId;
    console.log('[FIREBASE] Active church:', churchId);
}

function getActiveChurchId() {
    return _activeChurchId;
}

// ========================================
// PATH HELPERS
// ========================================

function churchCol(colName) {
    if (!_activeChurchId) throw new Error('churchId belum di-set');
    return window.firebaseCollection(window.db, 'churches', _activeChurchId, colName);
}

function churchDocRef(colName, docId) {
    if (!_activeChurchId) throw new Error('churchId belum di-set');
    return window.firebaseDoc(window.db, 'churches', _activeChurchId, colName, docId);
}

// ========================================
// READY CHECKS
// ========================================

function isFirebaseReady() {
    return typeof window.db !== 'undefined' && window.db !== null;
}

function isAuthReady() {
    return typeof window.auth !== 'undefined' && window.auth !== null;
}

// ========================================
// GENERIC CRUD — SCOPED KE GEREJA AKTIF
// ========================================

async function getAllDocuments(collectionName) {
    if (!isFirebaseReady()) return [];
    try {
        const snap = await window.firebaseGetDocs(churchCol(collectionName));
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error(`[FIREBASE] getAllDocuments(${collectionName}):`, e);
        return [];
    }
}

async function getDocumentById(collectionName, docId) {
    if (!isFirebaseReady()) return null;
    try {
        const snap = await window.firebaseGetDoc(churchDocRef(collectionName, docId));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (e) {
        console.error(`[FIREBASE] getDocumentById(${collectionName}/${docId}):`, e);
        return null;
    }
}

async function addDocument(collectionName, data) {
    if (!isFirebaseReady()) return null;
    try {
        const d = { ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        const ref = await window.firebaseAddDoc(churchCol(collectionName), d);
        return { id: ref.id, ...d };
    } catch (e) {
        console.error(`[FIREBASE] addDocument(${collectionName}):`, e);
        return null;
    }
}

async function setDocument(collectionName, docId, data) {
    if (!isFirebaseReady()) return false;
    try {
        await window.firebaseSetDoc(
            churchDocRef(collectionName, docId),
            { ...data, updatedAt: new Date().toISOString() },
            { merge: true }
        );
        return true;
    } catch (e) {
        console.error(`[FIREBASE] setDocument(${collectionName}/${docId}):`, e);
        return false;
    }
}

async function updateDocument(collectionName, docId, data) {
    if (!isFirebaseReady()) return false;
    try {
        await window.firebaseUpdateDoc(
            churchDocRef(collectionName, docId),
            { ...data, updatedAt: new Date().toISOString() }
        );
        return true;
    } catch (e) {
        console.error(`[FIREBASE] updateDocument(${collectionName}/${docId}):`, e);
        return false;
    }
}

async function deleteDocument(collectionName, docId) {
    if (!isFirebaseReady()) return false;
    try {
        await window.firebaseDeleteDoc(churchDocRef(collectionName, docId));
        return true;
    } catch (e) {
        console.error(`[FIREBASE] deleteDocument(${collectionName}/${docId}):`, e);
        return false;
    }
}

async function queryDocuments(collectionName, field, operator, value) {
    if (!isFirebaseReady()) return [];
    try {
        const q = window.firebaseQuery(
            churchCol(collectionName),
            window.firebaseWhere(field, operator, value)
        );
        const snap = await window.firebaseGetDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
        console.error(`[FIREBASE] queryDocuments(${collectionName}):`, e);
        return [];
    }
}

function onCollectionSnapshot(collectionName, callback) {
    if (!isFirebaseReady()) return () => {};
    try {
        return window.firebaseOnSnapshot(churchCol(collectionName), snap => {
            callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
    } catch (e) {
        console.error(`[FIREBASE] onCollectionSnapshot(${collectionName}):`, e);
        return () => {};
    }
}

async function batchWrite(operations) {
    if (!isFirebaseReady()) return false;
    try {
        const batch = window.firebaseWriteBatch(window.db);
        operations.forEach(op => {
            const ref = churchDocRef(op.collection, op.docId);
            if (op.type === 'set')    batch.set(ref, op.data, { merge: true });
            if (op.type === 'update') batch.update(ref, op.data);
            if (op.type === 'delete') batch.delete(ref);
        });
        await batch.commit();
        return true;
    } catch (e) {
        console.error('[FIREBASE] batchWrite:', e);
        return false;
    }
}

// ========================================
// CHURCH DOCUMENT OPERATIONS (top-level)
// ========================================

async function createChurch(churchData) {
    if (!isFirebaseReady()) return null;
    try {
        const ref = await window.firebaseAddDoc(
            window.firebaseCollection(window.db, 'churches'),
            {
                ...churchData,
                subscription: {
                    status: 'trial',
                    plan: 'free',
                    trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    expiresAt: null
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );
        console.log('[FIREBASE] Church created:', ref.id);
        return ref.id;
    } catch (e) {
        console.error('[FIREBASE] createChurch:', e);
        return null;
    }
}

async function getChurch(churchId) {
    if (!isFirebaseReady()) return null;
    try {
        const snap = await window.firebaseGetDoc(
            window.firebaseDoc(window.db, 'churches', churchId)
        );
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (e) {
        console.error('[FIREBASE] getChurch:', e);
        return null;
    }
}

async function updateChurch(churchId, data) {
    if (!isFirebaseReady()) return false;
    try {
        await window.firebaseUpdateDoc(
            window.firebaseDoc(window.db, 'churches', churchId),
            { ...data, updatedAt: new Date().toISOString() }
        );
        return true;
    } catch (e) {
        console.error('[FIREBASE] updateChurch:', e);
        return false;
    }
}

// ========================================
// USER PROFILE (top-level users/{uid})
// ========================================

async function getUserProfile(uid) {
    if (!isFirebaseReady()) return null;
    try {
        const snap = await window.firebaseGetDoc(
            window.firebaseDoc(window.db, 'users', uid)
        );
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (e) {
        console.error('[FIREBASE] getUserProfile:', e);
        return null;
    }
}

async function setUserProfile(uid, data) {
    if (!isFirebaseReady()) return false;
    try {
        await window.firebaseSetDoc(
            window.firebaseDoc(window.db, 'users', uid),
            { ...data, updatedAt: new Date().toISOString() },
            { merge: true }
        );
        return true;
    } catch (e) {
        console.error('[FIREBASE] setUserProfile:', e);
        return false;
    }
}

// ========================================
// AUTHENTICATION
// ========================================

async function loginWithFirebase(usernameOrEmail, password) {
    if (!isAuthReady()) return null;
    try {
        let email = usernameOrEmail;

        // Resolusi username → email
        if (!usernameOrEmail.includes('@')) {
            const q = window.firebaseQuery(
                window.firebaseCollection(window.db, 'users'),
                window.firebaseWhere('username', '==', usernameOrEmail)
            );
            const snap = await window.firebaseGetDocs(q);
            if (snap.empty) return null;
            email = snap.docs[0].data().email;
        }

        const credential = await window.firebaseSignIn(window.auth, email, password);
        const profile = await getUserProfile(credential.user.uid);
        if (!profile) return null;

        // Set gereja aktif untuk sesi ini
        setActiveChurch(profile.churchId);
        await setUserProfile(credential.user.uid, { lastLogin: new Date().toISOString() });

        const { password: _p, ...safe } = profile;
        return safe;
    } catch (e) {
        console.error('[FIREBASE] loginWithFirebase:', e.code);
        return null;
    }
}

async function registerChurch(churchData, adminData) {
    if (!isAuthReady() || !isFirebaseReady()) {
        return { success: false, error: 'Firebase tidak siap' };
    }
    try {
        // 1. Buat akun Firebase Auth
        const credential = await window.firebaseCreateUser(
            window.auth, adminData.email, adminData.password
        );
        const uid = credential.user.uid;

        // 2. Buat church document
        const churchId = await createChurch({
            ...churchData,
            superadminUid: uid
        });
        if (!churchId) throw new Error('Gagal membuat data gereja');

        // 3. Simpan profil user
        const profile = {
            uid,
            email: adminData.email,
            nama: adminData.nama,
            username: adminData.username || adminData.email.split('@')[0],
            role: 'superadmin',
            churchId,
            status: 'aktif',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        await setUserProfile(uid, profile);

        // 4. Set gereja aktif
        setActiveChurch(churchId);

        return { success: true, churchId, user: profile };
    } catch (e) {
        console.error('[FIREBASE] registerChurch:', e.code, e.message);
        let error = 'Registrasi gagal';
        if (e.code === 'auth/email-already-in-use') error = 'Email sudah terdaftar';
        if (e.code === 'auth/weak-password')        error = 'Password minimal 6 karakter';
        return { success: false, error };
    }
}

async function createChurchUser(userData) {
    if (!isAuthReady() || !_activeChurchId) return null;
    try {
        const credential = await window.firebaseCreateUser(
            window.auth, userData.email, userData.password
        );
        const profile = {
            uid: credential.user.uid,
            email: userData.email,
            nama: userData.nama,
            username: userData.username || userData.email.split('@')[0],
            role: userData.role || 'user',
            churchId: _activeChurchId,
            status: 'aktif',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };
        await setUserProfile(credential.user.uid, profile);
        return profile;
    } catch (e) {
        console.error('[FIREBASE] createChurchUser:', e.code);
        return null;
    }
}

async function logoutFromFirebase() {
    if (!isAuthReady()) return false;
    try {
        await window.firebaseSignOut(window.auth);
        _activeChurchId = null;
        return true;
    } catch (e) {
        console.error('[FIREBASE] logout:', e);
        return false;
    }
}

async function sendPasswordReset(email) {
    if (!isAuthReady()) return false;
    try {
        await window.firebaseSendPasswordResetEmail(window.auth, email);
        return true;
    } catch (e) {
        console.error('[FIREBASE] sendPasswordReset:', e);
        return false;
    }
}

// ========================================
// INIT & MIGRATION
// ========================================

async function initializeFirestoreData() {
    console.log('[FIREBASE] initializeFirestoreData: multi-tenant, no default users');
    return true;
}

async function migrateFromLocalStorage() {
    if (!isFirebaseReady() || !_activeChurchId) return false;
    try {
        const raw = localStorage.getItem('cmsV2Data');
        if (!raw) return true;
        const data = JSON.parse(raw);

        const keys = [
            'members','families','groups','events','attendance',
            'donations','donors','volunteers','assignments',
            'pemasukan','pengeluaran','announcements'
        ];

        for (const key of keys) {
            if (data[key]?.length) {
                for (const item of data[key]) {
                    const id = item.id ? String(item.id) : Date.now().toString();
                    const { password: _p, ...clean } = item;
                    await setDocument(key, id, clean);
                }
            }
        }
        if (data.finance)           await setDocument('financeConfig', 'config', data.finance);
        if (data.financeCategories) {
            for (const c of data.financeCategories) {
                await setDocument('financeCategories', String(c.id), c);
            }
        }

        localStorage.removeItem('cmsV2Data');
        console.log('[FIREBASE] Migration complete');
        return true;
    } catch (e) {
        console.error('[FIREBASE] migrateFromLocalStorage:', e);
        return false;
    }
}

// ========================================
// NOTIFICATIONS
// ========================================

async function getNotifications(userId = null) {
    if (!isFirebaseReady()) return [];
    try {
        const notifs = userId
            ? await queryDocuments('notifications', 'userId', '==', userId)
            : await getAllDocuments('notifications');
        return notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (e) { return []; }
}

async function addNotification(data) {
    return addDocument('notifications', { ...data, timestamp: new Date().toISOString(), read: false });
}

async function markNotificationRead(id) {
    return updateDocument('notifications', id, { read: true });
}

async function deleteNotification(id) {
    return deleteDocument('notifications', id);
}

// ========================================
// DB_COLLECTIONS (kompatibilitas app.js)
// ========================================

const DB_COLLECTIONS = {
    MEMBERS: 'members', FAMILIES: 'families', GROUPS: 'groups',
    EVENTS: 'events', ATTENDANCE: 'attendance', DONATIONS: 'donations',
    DONORS: 'donors', VOLUNTEERS: 'volunteers', ASSIGNMENTS: 'assignments',
    USERS: 'users', ANNOUNCEMENTS: 'announcements',
    PEMASUKAN: 'pemasukan', PENGELUARAN: 'pengeluaran',
    FINANCE_CATEGORIES: 'financeCategories', FINANCE_CONFIG: 'financeConfig',
    APPROVAL_HISTORY: 'approvalHistory', SETTINGS: 'settings',
    NOTIFICATIONS: 'notifications', DEATHS: 'deaths'
};

// ========================================
// EXPORT
// ========================================

window.DB_COLLECTIONS          = DB_COLLECTIONS;
window.isFirebaseReady         = isFirebaseReady;
window.isAuthReady             = isAuthReady;
window.setActiveChurch         = setActiveChurch;
window.getActiveChurchId       = getActiveChurchId;
window.getAllDocuments          = getAllDocuments;
window.getDocumentById         = getDocumentById;
window.addDocument             = addDocument;
window.setDocument             = setDocument;
window.updateDocument          = updateDocument;
window.deleteDocument          = deleteDocument;
window.queryDocuments          = queryDocuments;
window.onCollectionSnapshot    = onCollectionSnapshot;
window.batchWrite              = batchWrite;
window.createChurch            = createChurch;
window.getChurch               = getChurch;
window.updateChurch            = updateChurch;
window.getUserProfile          = getUserProfile;
window.setUserProfile          = setUserProfile;
window.loginWithFirebase       = loginWithFirebase;
window.registerChurch          = registerChurch;
window.createChurchUser        = createChurchUser;
window.logoutFromFirebase      = logoutFromFirebase;
window.sendPasswordReset       = sendPasswordReset;
window.initializeFirestoreData = initializeFirestoreData;
window.migrateFromLocalStorage = migrateFromLocalStorage;
window.getNotifications        = getNotifications;
window.addNotification         = addNotification;
window.markNotificationRead    = markNotificationRead;
window.deleteNotification      = deleteNotification;

console.log('[FIREBASE] Multi-tenant firebase.js loaded');


// Pasang ke objek window di bagian paling bawah file firebase.js
window.isFirebaseReady = isFirebaseReady;
