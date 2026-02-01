const dbName: string = "CSU_DR_Offline_Data_sync";
const storeName: string = "CSU_JSON_DR_sync";

export interface ICSU_JSON_DR_sync {
  idOldDR: string
  NomeRepresentante: string
  NIA: string
  EnergiaElectricaM1: string
  EnergiaElectricaM2: string
  EnergiaElectricaM3: string
  AguaM1: string
  AguaM2: string
  AguaM3: string
  GasCarvaoLenha: string
  Habitacao: string
  AlimHigiLimpeza: string
  Educacao: string
  Saude: string
  TransporteM: string
  arrMembro: string
  Parcer: string
  id:number
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

export async function csuDrDBSyncCreate(data: ICSU_JSON_DR_sync): Promise<number> {
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

export async function csuDrDBSyncRead(id: number): Promise<ICSU_JSON_DR_sync | undefined> {
    const db = await openDB();
    const store = getTransaction(db, 'readonly');
    return new Promise((resolve, reject) => {
        const request: IDBRequest<ICSU_JSON_DR_sync> = store.get(id);
        request.onsuccess = function(event: Event) {
            resolve((event.target as IDBRequest<ICSU_JSON_DR_sync>).result);
        };
        request.onerror = function(event: Event) {
            reject((event.target as IDBRequest).error);
        };
    });
}

export async function csuDrDBSyncReadAll(): Promise<ICSU_JSON_DR_sync[]> {
    const db = await openDB();
    const store = getTransaction(db, 'readonly');
    return new Promise((resolve, reject) => {
        //@ts-expect-error
        const request: IDBRequest<ICSU_JSON_DR_sync> = store.getAll();
        request.onsuccess = function(event: Event) {
            resolve((event.target as IDBRequest<ICSU_JSON_DR_sync[]>).result);
        };
        request.onerror = function(event: Event) {
            reject((event.target as IDBRequest).error);
        };
    });
}

export async function csuDrDBSyncUpdate(id: number, updatedData: Omit<ICSU_JSON_DR_sync, 'id'>): Promise<number> {
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

export async function csuDrDBSyncRemove(id: number): Promise<void> {
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

export function clearCSU_DR_Offline_Data_sync(){
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
