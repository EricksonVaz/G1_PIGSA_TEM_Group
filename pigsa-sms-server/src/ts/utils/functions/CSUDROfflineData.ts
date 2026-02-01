import { ICSU_DR_AGREGADO } from "../interfaces/ICSUDR";

const dbName: string = "CSU_DR_Offline_Data";
const storeName: string = "CSU_JSON_DR";

interface MyObject {
    id?: number;
    name: string;
    value: string;
}


function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request: IDBOpenDBRequest = indexedDB.open(dbName, 1);

        request.onupgradeneeded = function(event: IDBVersionChangeEvent) {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function(event: Event) {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = function(event: Event) {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
}

function getTransaction(db: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
    return db.transaction([storeName], mode).objectStore(storeName);
}

export async function csuDrDBcreate(data: ICSU_DR_AGREGADO[]): Promise<number> {
    const db = await openDB();
    const store = getTransaction(db, 'readwrite');
    return new Promise((resolve, reject) => {
        const request: IDBRequest<IDBValidKey> = store.add(data);
        request.onsuccess = function(event: Event) {
            resolve((event.target as IDBRequest<IDBValidKey>).result as number);
        };
        request.onerror = function(event: Event) {
            reject((event.target as IDBRequest).error);
        };
    });
}

export async function csuDrDBread(id: number): Promise<ICSU_DR_AGREGADO[] | undefined> {
    const db = await openDB();
    const store = getTransaction(db, 'readonly');
    return new Promise((resolve, reject) => {
        const request: IDBRequest<ICSU_DR_AGREGADO[]> = store.get(id);
        request.onsuccess = function(event: Event) {
            resolve((event.target as IDBRequest<ICSU_DR_AGREGADO[]>).result);
        };
        request.onerror = function(event: Event) {
            reject((event.target as IDBRequest).error);
        };
    });
}

export async function csuDrDBreadAll(): Promise<ICSU_DR_AGREGADO[][]> {
    const db = await openDB();
    const store = getTransaction(db, 'readonly');
    return new Promise((resolve, reject) => {
        const request: IDBRequest<MyObject[]> = store.getAll();
        request.onsuccess = function(event: Event) {
            resolve((event.target as IDBRequest<ICSU_DR_AGREGADO[][]>).result);
        };
        request.onerror = function(event: Event) {
            reject((event.target as IDBRequest).error);
        };
    });
}

export async function csuDrDBupdate(id: number, updatedData: Omit<ICSU_DR_AGREGADO[], 'id'>): Promise<number> {
    const db = await openDB();
    const store = getTransaction(db, 'readwrite');
    return new Promise((resolve, reject) => {
        const request: IDBRequest<IDBValidKey> = store.put({ ...updatedData, id });
        request.onsuccess = function(event: Event) {
            resolve((event.target as IDBRequest<IDBValidKey>).result as number);
        };
        request.onerror = function(event: Event) {
            reject((event.target as IDBRequest).error);
        };
    });
}

export async function csuDrDBremove(id: number): Promise<void> {
    const db = await openDB();
    const store = getTransaction(db, 'readwrite');
    return new Promise((resolve, reject) => {
        //@ts-expect-error
        const request: IDBRequest<void> = store.delete(id);
        request.onsuccess = function(event: Event) {
            resolve();
        };
        request.onerror = function(event: Event) {
            reject((event.target as IDBRequest).error);
        };
    });
}

export function clearCSU_DR_Offline_Data(){
    window.indexedDB.deleteDatabase(dbName);
}

// // Exemplos de uso

// // Criar um novo item
// create({ name: "Item 1", value: "This is item 1" }).then(id => console.log("Item criado com ID:", id));

// // Ler um item
// read(1).then(item => console.log("Item lido:", item));

// // Ler todos os itens
// readAll().then(items => console.log("Todos os itens:", items));

// // Atualizar um item
// update(1, { name: "Item 1 updated", value: "This is updated item 1" }).then(id => console.log("Item atualizado com ID:", id));

// // Remover um item
// csuDrDBremove(1).then(() => console.log("Item removido"));
