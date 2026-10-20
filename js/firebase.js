/**
 * Church Management System V6 - Firebase Integration
 * Firestore Database Operations with Error Handling
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

// Import Firebase modules
try {
    console.log('[FIREBASE] Importing modules...');
    
    // Dynamic import for Firebase modules
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js");
    const { 
        getFirestore, collection, addDoc, getDocs, doc, setDoc, 
        updateDoc, deleteDoc, getDoc, query, where, orderBy, 
        onSnapshot, writeBatch 
    } = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js");
    const { 
        getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, 
        onAuthStateChanged, signOut 
    } = await import("https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js");
    
    console.log('[FIREBASE] Modules imported successfully');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    console.log('[FIREBASE] App initialized:', app.name);
    
    const db = getFirestore(app);
    console.log('[FIREBASE] Firestore initialized');
    
    const auth = getAuth(app);
    console.log('[FIREBASE] Auth initialized');
    
    // Expose to global scope
    window.firebaseApp = app;
    window.db = db;
    window.auth = auth;
    window.firebaseCollection = collection;
    window.firebaseAddDoc = addDoc;
    window.firebaseGetDocs = getDocs;
    window.firebaseDoc = doc;
    window.firebaseSetDoc = setDoc;
    window.firebaseUpdateDoc = updateDoc;
    window.firebaseDeleteDoc = deleteDoc;
    window.firebaseGetDoc = getDoc;
    window.firebaseQuery = query;
    window.firebaseWhere = where;
    window.firebaseOrderBy = orderBy;
    window.firebaseOnSnapshot = onSnapshot;
    window.firebaseWriteBatch = writeBatch;
    window.firebaseSignIn = signInWithEmailAndPassword;
    window.firebaseCreateUser = createUserWithEmailAndPassword;
    window.firebaseOnAuthStateChanged = onAuthStateChanged;
    window.firebaseSignOut = signOut;
    
    console.log('[FIREBASE] All modules exposed to window');
    
} catch (error) {
    console.error('[FIREBASE] Initialization error:', error);
    window.firebaseInitError = error.message;
}

// ========================================
// FIREBASE DATA OPERATIONS
// ========================================

const DB_COLLECTIONS = {
    MEMBERS: 'members',
    FAMILIES: 'families',
    GROUPS: 'groups',
    EVENTS: 'events',
    ATTENDANCE: 'attendance',
    DONATIONS: 'donations',
    DONORS: 'donors',
    VOLUNTEERS: 'volunteers',
    ASSIGNMENTS: 'assignments',
    USERS: 'users',
    ANNOUNCEMENTS: 'announcements',
    PEMASUKAN: 'pemasukan',
    PENGELUARAN: 'pengeluaran',
    FINANCE_CATEGORIES: 'financeCategories',
    FINANCE_CONFIG: 'financeConfig',
    APPROVAL_HISTORY: 'approvalHistory',
    SETTINGS: 'settings',
    NOTIFICATIONS: 'notifications'
};

// Check if Firebase is initialized
function isFirebaseReady() {
    const ready = typeof window.db !== 'undefined' && window.db !== null;
    console.log('[FIREBASE] isReady:', ready);
    return ready;
}

// ========================================
// GENERIC CRUD OPERATIONS WITH ERROR HANDLING
// ========================================

// Get all documents from a collection
async function getAllDocuments(collectionName) {
    console.log(`[FIREBASE] getAllDocuments START: ${collectionName}`);
    
    if (!isFirebaseReady()) {
        console.error('[FIREBASE] Not initialized');
        return [];
    }
    
    try {
        const colRef = window.firebaseCollection(window.db, collectionName);
        console.log(`[FIREBASE] Querying collection: ${collectionName}`);
        
        const snapshot = await window.firebaseGetDocs(colRef);
        console.log(`[FIREBASE] Got ${snapshot.docs.length} documents from ${collectionName}`);
        
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`[FIREBASE] Error getting ${collectionName}:`, error);
        console.error('[FIREBASE] Error code:', error.code);
        console.error('[FIREBASE] Error message:', error.message);
        return [];
    }
}

// Get document by ID
async function getDocumentById(collectionName, docId) {
    console.log(`[FIREBASE] getDocumentById START: ${collectionName}/${docId}`);
    
    if (!isFirebaseReady()) return null;
    
    try {
        const docRef = window.firebaseDoc(window.db, collectionName, docId);
        const snapshot = await window.firebaseGetDoc(docRef);
        
        if (snapshot.exists()) {
            console.log(`[FIREBASE] Document found: ${collectionName}/${docId}`);
            return { id: snapshot.id, ...snapshot.data() };
        }
        console.log(`[FIREBASE] Document not found: ${collectionName}/${docId}`);
        return null;
    } catch (error) {
        console.error(`[FIREBASE] Error getting ${collectionName}/${docId}:`, error);
        return null;
    }
}

// Add new document with auto ID
async function addDocument(collectionName, data) {
    console.log(`[FIREBASE] addDocument START: ${collectionName}`);
    
    if (!isFirebaseReady()) return null;
    
    try {
        const colRef = window.firebaseCollection(window.db, collectionName);
        const docData = {
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const docRef = await window.firebaseAddDoc(colRef, docData);
        console.log(`[FIREBASE] Document added: ${collectionName}/${docRef.id}`);
        return { id: docRef.id, ...docData };
    } catch (error) {
        console.error(`[FIREBASE] Error adding to ${collectionName}:`, error);
        console.error('[FIREBASE] Error code:', error.code);
        console.error('[FIREBASE] Error message:', error.message);
        return null;
    }
}

// Set document with specific ID
async function setDocument(collectionName, docId, data) {
    console.log(`[FIREBASE] setDocument START: ${collectionName}/${docId}`);
    
    if (!isFirebaseReady()) {
        console.error('[FIREBASE] Not ready, cannot set document');
        return false;
    }
    
    try {
        const docRef = window.firebaseDoc(window.db, collectionName, docId);
        const docData = {
            ...data,
            updatedAt: new Date().toISOString()
        };
        
        await window.firebaseSetDoc(docRef, docData, { merge: true });
        console.log(`[FIREBASE] Document set: ${collectionName}/${docId}`);
        return true;
    } catch (error) {
        console.error(`[FIREBASE] Error setting ${collectionName}/${docId}:`, error);
        console.error('[FIREBASE] Error code:', error.code);
        console.error('[FIREBASE] Error message:', error.message);
        return false;
    }
}

// Update document
async function updateDocument(collectionName, docId, data) {
    console.log(`[FIREBASE] updateDocument START: ${collectionName}/${docId}`);
    
    if (!isFirebaseReady()) return false;
    
    try {
        const docRef = window.firebaseDoc(window.db, collectionName, docId);
        const docData = {
            ...data,
            updatedAt: new Date().toISOString()
        };
        
        await window.firebaseUpdateDoc(docRef, docData);
        console.log(`[FIREBASE] Document updated: ${collectionName}/${docId}`);
        return true;
    } catch (error) {
        console.error(`[FIREBASE] Error updating ${collectionName}/${docId}:`, error);
        return false;
    }
}

// Delete document
async function deleteDocument(collectionName, docId) {
    console.log(`[FIREBASE] deleteDocument START: ${collectionName}/${docId}`);
    
    if (!isFirebaseReady()) return false;
    
    try {
        const docRef = window.firebaseDoc(window.db, collectionName, docId);
        await window.firebaseDeleteDoc(docRef);
        console.log(`[FIREBASE] Document deleted: ${collectionName}/${docId}`);
        return true;
    } catch (error) {
        console.error(`[FIREBASE] Error deleting ${collectionName}/${docId}:`, error);
        return false;
    }
}

// Query documents
async function queryDocuments(collectionName, field, operator, value) {
    console.log(`[FIREBASE] queryDocuments START: ${collectionName} ${field} ${operator} ${value}`);
    
    if (!isFirebaseReady()) return [];
    
    try {
        const colRef = window.firebaseCollection(window.db, collectionName);
        const q = window.firebaseQuery(colRef, window.firebaseWhere(field, operator, value));
        const snapshot = await window.firebaseGetDocs(q);
        
        console.log(`[FIREBASE] Query returned ${snapshot.docs.length} documents`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`[FIREBASE] Error querying ${collectionName}:`, error);
        return [];
    }
}

// ========================================
// REAL-TIME LISTENERS
// ========================================

function onCollectionSnapshot(collectionName, callback) {
    console.log(`[FIREBASE] onCollectionSnapshot START: ${collectionName}`);
    
    if (!isFirebaseReady()) return () => {};
    
    try {
        const colRef = window.firebaseCollection(window.db, collectionName);
        return window.firebaseOnSnapshot(colRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log(`[FIREBASE] Snapshot update for ${collectionName}: ${data.length} items`);
            callback(data);
        }, (error) => {
            console.error(`[FIREBASE] Snapshot error for ${collectionName}:`, error);
        });
    } catch (error) {
        console.error(`[FIREBASE] Error setting up snapshot for ${collectionName}:`, error);
        return () => {};
    }
}

// ========================================
// BATCH OPERATIONS
// ========================================

async function batchWrite(operations) {
    console.log(`[FIREBASE] batchWrite START: ${operations.length} operations`);
    
    if (!isFirebaseReady()) return false;
    
    try {
        const batch = window.firebaseWriteBatch(window.db);
        
        operations.forEach(op => {
            const docRef = window.firebaseDoc(window.db, op.collection, op.docId);
            if (op.type === 'set') {
                batch.set(docRef, op.data, { merge: true });
            } else if (op.type === 'update') {
                batch.update(docRef, op.data);
            } else if (op.type === 'delete') {
                batch.delete(docRef);
            }
        });
        
        await batch.commit();
        console.log('[FIREBASE] Batch write completed');
        return true;
    } catch (error) {
        console.error('[FIREBASE] Batch write error:', error);
        return false;
    }
}

// ========================================
// INITIALIZATION FUNCTIONS
// ========================================

async function initializeFirestoreData() {
    console.log('[FIREBASE] initializeFirestoreData START');
    
    if (!isFirebaseReady()) {
        console.error('[FIREBASE] Not ready, skipping initialization');
        return false;
    }
    
    try {
        // Check if users collection exists
        console.log('[FIREBASE] Checking users collection...');
        const users = await getAllDocuments(DB_COLLECTIONS.USERS);
        console.log(`[FIREBASE] Found ${users.length} users`);
        
        if (users.length === 0) {
            console.log('[FIREBASE] Creating default users...');
            
            // Create default users
            await setDocument(DB_COLLECTIONS.USERS, 'admin', {
                id: 'admin',
                username: 'admin',
                nama: 'Administrator',
                email: 'admin@church.com',
                role: 'admin',
                password: 'admin123',
                createdAt: new Date().toISOString()
            });
            
            await setDocument(DB_COLLECTIONS.USERS, 'superadmin', {
                id: 'superadmin',
                username: 'superadmin',
                nama: 'Super Admin',
                email: 'superadmin@church.com',
                role: 'superadmin',
                password: 'super123',
                createdAt: new Date().toISOString()
            });
            
            await setDocument(DB_COLLECTIONS.USERS, 'user', {
                id: 'user',
                username: 'user',
                nama: 'User View',
                email: 'user@church.com',
                role: 'user',
                password: 'user123',
                createdAt: new Date().toISOString()
            });
            
            console.log('[FIREBASE] Default users created');
        }
        
        return true;
    } catch (error) {
        console.error('[FIREBASE] Error initializing data:', error);
        return false;
    }
}

// ========================================
// AUTHENTICATION
// ========================================

async function loginWithFirebase(username, password) {
    console.log(`[FIREBASE] loginWithFirebase START: ${username}`);
    
    if (!isFirebaseReady()) {
        console.error('[FIREBASE] Not ready for login');
        return null;
    }
    
    try {
        // Query users collection
        console.log('[FIREBASE] Querying user...');
        const users = await queryDocuments(DB_COLLECTIONS.USERS, 'username', '==', username);
        console.log(`[FIREBASE] Found ${users.length} matching users`);
        
        if (users.length === 0) {
            console.log('[FIREBASE] User not found');
            return null;
        }
        
        const user = users[0];
        
        // Check password (in production, use Firebase Auth)
        if (user.password === password) {
            console.log('[FIREBASE] Login successful');
            // Remove password from returned object
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        
        console.log('[FIREBASE] Password mismatch');
        return null;
    } catch (error) {
        console.error('[FIREBASE] Login error:', error);
        return null;
    }
}

// ========================================
// NOTIFICATION FUNCTIONS
// ========================================

async function getNotifications(userId = null) {
    console.log(`[FIREBASE] getNotifications START: ${userId || 'all'}`);
    
    if (!isFirebaseReady()) return [];
    
    try {
        let notifications;
        if (userId) {
            notifications = await queryDocuments(DB_COLLECTIONS.NOTIFICATIONS, 'userId', '==', userId);
        } else {
            notifications = await getAllDocuments(DB_COLLECTIONS.NOTIFICATIONS);
        }
        
        // Sort by timestamp descending
        notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        console.log(`[FIREBASE] Got ${notifications.length} notifications`);
        return notifications;
    } catch (error) {
        console.error('[FIREBASE] Error getting notifications:', error);
        return [];
    }
}

async function addNotification(notificationData) {
    console.log('[FIREBASE] addNotification START');
    
    if (!isFirebaseReady()) return null;
    
    try {
        const data = {
            ...notificationData,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        const result = await addDocument(DB_COLLECTIONS.NOTIFICATIONS, data);
        console.log('[FIREBASE] Notification added:', result?.id);
        return result;
    } catch (error) {
        console.error('[FIREBASE] Error adding notification:', error);
        return null;
    }
}

async function markNotificationRead(notificationId) {
    console.log(`[FIREBASE] markNotificationRead START: ${notificationId}`);
    
    if (!isFirebaseReady()) return false;
    
    try {
        await updateDocument(DB_COLLECTIONS.NOTIFICATIONS, notificationId, { read: true });
        console.log('[FIREBASE] Notification marked as read');
        return true;
    } catch (error) {
        console.error('[FIREBASE] Error marking notification read:', error);
        return false;
    }
}

async function deleteNotification(notificationId) {
    console.log(`[FIREBASE] deleteNotification START: ${notificationId}`);
    
    if (!isFirebaseReady()) return false;
    
    try {
        await deleteDocument(DB_COLLECTIONS.NOTIFICATIONS, notificationId);
        console.log('[FIREBASE] Notification deleted');
        return true;
    } catch (error) {
        console.error('[FIREBASE] Error deleting notification:', error);
        return false;
    }
}

// ========================================
// DATA MIGRATION
// ========================================

async function migrateFromLocalStorage() {
    console.log('[FIREBASE] migrateFromLocalStorage START');
    
    if (!isFirebaseReady()) {
        console.log('[FIREBASE] Not ready, skipping migration');
        return false;
    }
    
    try {
        const localData = localStorage.getItem('churchData');
        if (!localData) {
            console.log('[FIREBASE] No local data to migrate');
            return true;
        }
        
        const data = JSON.parse(localData);
        console.log('[FIREBASE] Migrating data from localStorage...');
        
        // Migrate each collection
        const collections = [
            { key: 'members', collection: DB_COLLECTIONS.MEMBERS },
            { key: 'families', collection: DB_COLLECTIONS.FAMILIES },
            { key: 'groups', collection: DB_COLLECTIONS.GROUPS },
            { key: 'events', collection: DB_COLLECTIONS.EVENTS },
            { key: 'attendance', collection: DB_COLLECTIONS.ATTENDANCE },
            { key: 'donations', collection: DB_COLLECTIONS.DONATIONS },
            { key: 'donors', collection: DB_COLLECTIONS.DONORS },
            { key: 'volunteers', collection: DB_COLLECTIONS.VOLUNTEERS },
            { key: 'assignments', collection: DB_COLLECTIONS.ASSIGNMENTS },
            { key: 'pemasukan', collection: DB_COLLECTIONS.PEMASUKAN },
            { key: 'pengeluaran', collection: DB_COLLECTIONS.PENGELUARAN },
            { key: 'announcements', collection: DB_COLLECTIONS.ANNOUNCEMENTS }
        ];
        
        for (const { key, collection } of collections) {
            if (data[key] && data[key].length > 0) {
                console.log(`[FIREBASE] Migrating ${data[key].length} ${key}...`);
                for (const item of data[key]) {
                    const id = item.id ? String(item.id) : Date.now().toString();
                    await setDocument(collection, id, item);
                }
            }
        }
        
        console.log('[FIREBASE] Migration completed');
        localStorage.removeItem('churchData');
        return true;
    } catch (error) {
        console.error('[FIREBASE] Migration error:', error);
        return false;
    }
}

// ========================================
// EXPORT TO GLOBAL
// ========================================

window.DB_COLLECTIONS = DB_COLLECTIONS;
window.isFirebaseReady = isFirebaseReady;
window.getAllDocuments = getAllDocuments;
window.getDocumentById = getDocumentById;
window.addDocument = addDocument;
window.setDocument = setDocument;
window.updateDocument = updateDocument;
window.deleteDocument = deleteDocument;
window.queryDocuments = queryDocuments;
window.onCollectionSnapshot = onCollectionSnapshot;
window.batchWrite = batchWrite;
window.initializeFirestoreData = initializeFirestoreData;
window.loginWithFirebase = loginWithFirebase;
window.migrateFromLocalStorage = migrateFromLocalStorage;

// Notification exports
window.getNotifications = getNotifications;
window.addNotification = addNotification;
window.markNotificationRead = markNotificationRead;
window.deleteNotification = deleteNotification;

console.log('[FIREBASE] Script loaded successfully');
